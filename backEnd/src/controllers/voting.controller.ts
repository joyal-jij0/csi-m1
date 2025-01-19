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


let currentVoting: {
    performanceId: string;
    countdown: number;
    timer: NodeJS.Timeout;
} | null = null;

const globalClients: Response[] = [];

const createSSEStream = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); //dev only
    res.setHeader("X-Accel-Buffering", "no"); // otherwise nginx will buffer the response
    res.flushHeaders();

    const votingStarted = !!currentVoting && currentVoting.countdown > 0;

    res.write(
        `data: ${JSON.stringify({
            votingStarted,
            performance: votingStarted && currentVoting 
                ? await prisma.performance.findUnique({ where: { id: currentVoting.performanceId } })
                : null,
            secondsLeft: votingStarted && currentVoting ? currentVoting.countdown : 0,
        })}\n\n`
    );    

    globalClients.push(res);

    const heartbeatId = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 3000);

    req.on('close', () => {
        clearInterval(heartbeatId);
        const index = globalClients.indexOf(res);
        if (index !== -1) globalClients.splice(index, 1);
    });
});

const broadcastToClients = (data: any) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    globalClients.forEach((client) => client.write(payload));
};


const startVoting = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const { performanceId } = req.params;
    const { votingDuration } = req.body; // seconds

    if (!votingDuration || votingDuration < 0) {
        throw new ApiError(400, "Invalid votingDuration.");
    }

    if (typeof votingDuration !== 'number') {
        throw new ApiError(400, "votingDuration must be a number (in seconds).");
    }

    // If there is an ongoing vote
    if (currentVoting) {
        clearInterval(currentVoting.timer);
        currentVoting = null;
    }

    // Start the countdown process for this performance
    currentVoting = {
        performanceId,
        countdown: votingDuration,
        timer: setInterval(async () => {
            if (!currentVoting) return;

            currentVoting.countdown -= 1;

            // when the countdown ends
            if (currentVoting.countdown < 0) {
                clearInterval(currentVoting.timer);
                currentVoting = null;

                await prisma.performance.update({
                    where: { id: performanceId },
                    data: { votingStarted: false },
                });

                broadcastToClients({ votingStarted: false });
            } else {
                const performance = await prisma.performance.findUnique({
                    where: { id: performanceId },
                });

                broadcastToClients({
                    votingStarted: true,
                    performance,
                    secondsLeft: currentVoting.countdown,
                });
            }
        }, 1000),
    };

    await prisma.performance.update({
        where: { id: performanceId },
        data: {
            votingStarted: true,
            votingStartedAt: new Date().toISOString(),
            votingDuration,
        },
    });

    // Broadcast initial voting state to clients
    const performance = await prisma.performance.findUnique({
        where: { id: performanceId },
    });
    broadcastToClients({
        votingStarted: true,
        performance,
        secondsLeft: votingDuration,
    });

    res.json({ performance, message: "Voting started successfully." });
});


const endVoting = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    if (currentVoting) {
        clearInterval(currentVoting.timer);

        await prisma.performance.update({
            where: { id: currentVoting.performanceId },
            data: { votingStarted: false },
        });

        currentVoting = null;

        broadcastToClients({ votingStarted: false });
    }

    res.json({ message: "Voting ended successfully." });
});

const submitVote = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const { vote } = req.body;

    if (typeof vote !== 'boolean') {
        throw new ApiError(400, "Invalid vote value. Must be a boolean.");
    }

    if (!currentVoting || currentVoting.countdown <= 0) {
        throw new ApiError(403, "Voting has ended or is not active.");
    }

    const existingVote = await prisma.vote.findFirst({
        where: {
            performanceId: currentVoting.performanceId,
            userId,
        },
    });

    if (existingVote) {
        throw new ApiError(403, "You have already voted for this performance.");
    }

    await prisma.vote.create({
        data: {
            performanceId: currentVoting.performanceId,
            userId,
            vote,
        },
    });

    res.status(200).json({ message: "Vote submitted successfully." });
});


export { createSSEStream, submitVote, startVoting, endVoting }