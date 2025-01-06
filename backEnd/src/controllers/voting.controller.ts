import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import { User } from "@prisma/client";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";

const isAdminCheck = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isAdmin) {
        throw new ApiError(403, "Access denied. Admins only!");
    }
};

const clients: any = {};
const timers: Record<string, NodeJS.Timeout> = {};
const countdowns: Record<string, number> = {}; // remaining time for each performance

const createSSEStream = asyncHandler(async (req: Request, res: Response) => {
    const { performanceId } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); //dev only
    res.flushHeaders();

    const secondsLeft = Math.max(countdowns[performanceId] || 0, 0);
    const votingStarted = secondsLeft > 0;

    res.write(`data: ${JSON.stringify({ votingStarted, secondsLeft })}\n\n`);

    if (!clients[performanceId]) clients[performanceId] = [];
    clients[performanceId].push(res);

    const heartbeatId = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 3000);

    req.on('close', () => {
        clearInterval(heartbeatId);
        clients[performanceId] = clients[performanceId].filter((client: Response) => client !== res);
    });
});


const submitVote = asyncHandler(async (req: Request, res: Response) => {
    const { performanceId } = req.params;
    const userId = (req.user as JwtPayload).userId;
    const vote: boolean = req.body.vote;

    if (typeof vote !== 'boolean') {
        throw new ApiError(400, "Invalid vote value. Must be a boolean.");
    }

    // checking if voting is still active
    const secondsLeft = Math.max(countdowns[performanceId] || 0, 0);

    if (secondsLeft <= 0) {
        throw new ApiError(403, "Voting has ended for this performance.");
    }

    const data = await prisma.performance.findUnique({
        where: { id: performanceId },
        include: {
            votes: { where: { userId } }, // Check if the user has already voted
        },
    });
    
    if (!data) {
        throw new ApiError(404, "Performance not found.");
    }
    if (data.votes.length > 0) {
        throw new ApiError(403, "You have already voted for this performance.");
    }
    
    await prisma.vote.create({
        data: {
            performanceId,
            userId,
            vote,
        },
    });

    res.status(200).json({ message: "Vote submitted successfully." });
});

const startVoting = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const { performanceId } = req.params;
    const { votingDuration } = req.body; // seconds

    if (!votingDuration || votingDuration < 0) {
        throw new ApiError(400, "Invalid voting duration.")
    }

    if (typeof votingDuration !== 'number') {
        throw new ApiError(400, "votingDuration must be a number (in seconds).")
    }

    const performance = await prisma.performance.updateMany({
        where: { id: performanceId },
        data: { votingStarted: true, votingStartedAt: new Date().toISOString(), votingDuration },
    });

    if (clients[performanceId]) {
        clients[performanceId].forEach((client: { write: (arg0: string) => any; }) => 
            client.write(`data: ${JSON.stringify({ votingStarted: true, currentSecond: votingDuration })}\n\n`)
        );
    }

    // starting the countdown
    countdowns[performanceId] = votingDuration;
    timers[performanceId] = setInterval(() => {
        countdowns[performanceId] -= 1;

        // notify clients of the current second
        if (clients[performanceId]) {
            clients[performanceId].forEach((client: { write: (arg0: string) => any; }) => 
                client.write(`data: ${JSON.stringify({ 
                    votingStarted: countdowns[performanceId] > 0, 
                    currentSecond: Math.max(countdowns[performanceId], 0) 
                })}\n\n`)
            );
        }

        // stop tje voting after duration + buffer
        if (countdowns[performanceId] < -10) {
            clearInterval(timers[performanceId]);
            delete timers[performanceId];
            delete countdowns[performanceId];

            prisma.performance.update({
                where: { id: performanceId },
                data: { votingStarted: false },
            });

            if (clients[performanceId]) {
                clients[performanceId].forEach((client: { write: (arg0: string) => any; }) => 
                    client.write(`data: ${JSON.stringify({ votingStarted: false })}\n\n`)
                );
            }
        }
    }, 1000);

    res.json({performance, message: "Voting started successfully."});
});

const endVoting = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const { performanceId } = req.params;
    const performance = await prisma.performance.update({
        where: { id: performanceId },
        data: { votingStarted: false },
    });

    if (timers[performanceId]) {
        clearInterval(timers[performanceId]);
        delete timers[performanceId];
        delete countdowns[performanceId];
    }

    if (clients[performanceId]) {
        clients[performanceId].forEach((client: { write: (arg0: string) => any; }) =>
            client.write(`data: ${JSON.stringify({ votingStarted: false })}\n\n`)
        );
    }

    res.json({performance, message: "Voting ended successfully."});
});
export { createSSEStream, submitVote, startVoting, endVoting }