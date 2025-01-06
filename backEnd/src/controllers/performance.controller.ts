import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import { User } from "@prisma/client";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";
import { start } from "repl";

const isAdminCheck = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isAdmin) {
        throw new ApiError(403, "Access denied. Admins only!");
    }
};
// model Performance {
//     id         String    @id @default(cuid())
//     name       String
//     startTime  DateTime?
//     performers String[]
//     image      String?
//     eventId    String 
//     event      Event @relation(fields: [eventId], references: [id])
  
//     votingStarted  Boolean @default(false)
//     votingDuration Int?
//     votes          Vote[]
//   }
const createPerformance = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);
    
    const { name, startTime, performers, image, eventId } = req.body;

    if (!name || !startTime || !performers || !eventId) {
        throw new ApiError(400, "All fields (name, startTime, performers, eventId) are required");
    }

    if (
        typeof name !== "string" ||
        isNaN(new Date(startTime).getTime()) ||
        !Array.isArray(performers) ||
        typeof eventId !== "string" ||
        (image !== undefined && typeof image !== "string")
    ) {
        throw new ApiError(400, "Invalid input types");
    }

    //check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
        throw new ApiError(404, "Event not found");
    }


    // Create performance

    const performance = await prisma.performance.create({
        data: {
            name,
            startTime,
            performers,
            image,
            eventId,
        },
});

    return res.status(201).json(
        new ApiResponse<typeof performance>({
            statusCode: 201,
            data: performance,
            message: "Performance created successfully",
        })
    );
});

const updatePerformance = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const {performanceId} = req.params;
    const {name, startTime, performers, image, eventId} = req.body;

    // Check if performance exists
    const performanceCheck = await prisma.performance.findUnique({ where: { id: performanceId } });
    if (!performanceCheck) {
        throw new ApiError(404, "Performance not found");
    }

    if (!name && !startTime && !performers && !image && !eventId) {
        throw new ApiError(400, "At least one field (name, startTime, performers, image, eventId) is required");
    }

    if (
        (name !== undefined && typeof name !== "string") ||
        (startTime !== undefined && isNaN(new Date(startTime).getTime())) ||
        (performers !== undefined && !Array.isArray(performers)) ||
        (eventId !== undefined && typeof eventId !== "string") ||
        (image !== undefined && typeof image !== "string")
    ) {
        throw new ApiError(400, "Invalid input types");
    }

    // Check if event exists
    if (eventId) {
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            throw new ApiError(404, "Event not found");
        }
    }

    // Update performance
    const performance = await prisma.performance.update({
        where: { id: performanceId },
        data: {
            name,
            startTime,
            performers,
            image,
            eventId,
        },
    });

    return res.status(200).json(
        new ApiResponse<typeof performance>({
            statusCode: 200,
            data: performance,
            message: "Performance updated successfully",
        })
    );
})

const deletePerformance = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const {performanceId} = req.params;

    // Check if performance exists
    const performanceCheck = await prisma.performance.findUnique({ where: { id: performanceId } });
    if (!performanceCheck) {
        throw new ApiError(404, "Performance not found");
    }

    // Delete performance
    await prisma.performance.delete({ where: { id: performanceId } });

    return res.status(200).json(
        new ApiResponse<null>({
            statusCode: 200,
            data: null,
            message: "Performance deleted successfully",
        })
    );
});

const getPerformance = asyncHandler(async (req: Request, res: Response) => {
    const { performanceId } = req.params;

    // Check if performance exists
    const performance = await prisma.performance.findUnique({
        where: { id: performanceId },
    });

    if (!performance) {
        throw new ApiError(404, "Performance not found");
    }

    return res.status(200).json(
        new ApiResponse<typeof performance>({
            statusCode: 200,
            data: performance,
            message: "Performance retrieved successfully",
        })
    );
});

const getPerformances = asyncHandler(async (req: Request, res: Response) => {
    const performances = await prisma.performance.findMany();

    return res.status(200).json(
        new ApiResponse<typeof performances>({
            statusCode: 200,
            data: performances,
            message: "Performances retrieved successfully",
        })
    );
});

export {createPerformance, updatePerformance, deletePerformance, getPerformance, getPerformances}