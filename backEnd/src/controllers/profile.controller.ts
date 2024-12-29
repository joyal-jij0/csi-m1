import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import { User } from "@prisma/client";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";

// profile creation controller:-

const createProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name, college, year, program, branch } = req.body;

    // Extract userId from req.user
    const userId = (req.user as JwtPayload).userId;

    if (!userId) {
        throw new ApiError(400, "Unauthorized: Missing user information");
    }

    // Input validation
    if (!name || !college || !year || !program || !branch) {
        throw new ApiError(400, "All fields (name, college, year, program, branch) are required");
    }

    if (typeof name !== "string" || typeof college !== "string" || typeof program !== "string" || typeof branch !== "string") {
        throw new ApiError(400, "Invalid input types");
    }

    if (typeof year !== "number" || year <= 0) {
        throw new ApiError(400, "Year must be a positive number");
    }

    // Check if the profile already exists
    const existingProfile = await prisma.profile.findUnique({ where: { userId } });
    if (existingProfile) {
        throw new ApiError(400, "Profile already exists for this user");
    }

    // Create profile
    const profile = await prisma.profile.create({
        data: {
            userId,
            name,
            college,
            year,
            program,
            branch,
        },
    });

    return res.status(201).json(
        new ApiResponse<typeof profile>({
            statusCode: 201,
            data: profile,
            message: "Profile created successfully",
        })
    );
});


// profile updation controller:-

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name, college, year, program, branch } = req.body;

    // Extract userId from req.user
    const userId = (req.user as JwtPayload).userId;

    if (!userId) {
        throw new ApiError(400, "Unauthorized: Missing user information");
    }

    // Check if the profile exists
    const existingProfile = await prisma.profile.findUnique({ where: { userId } });
    if (!existingProfile) {
        throw new ApiError(404, "Profile not found");
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: {
            ...(name && { name }),
            ...(college && { college }),
            ...(year && { year }),
            ...(program && { program }),
            ...(branch && { branch }),
        },
    });

    return res.status(200).json(
        new ApiResponse<typeof updatedProfile>({
            statusCode: 200,
            data: updatedProfile,
            message: "Profile updated successfully",
        })
    );
});

// profile retrieval controller:-

const getProfile = asyncHandler(async (req: Request, res: Response) => {
    // Extract userId from req.user
    const userId = (req.user as JwtPayload).userId;

    if (!userId) {
        throw new ApiError(400, "Unauthorized: Missing user information");
    }

    // Fetch the user's profile
    const profile = await prisma.profile.findUnique({
        where: { userId },
    });

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    return res.status(200).json(
        new ApiResponse<typeof profile>({
            statusCode: 200,
            data: profile,
            message: "Profile retrieved successfully",
        })
    );
});

export { createProfile, updateProfile, getProfile };
