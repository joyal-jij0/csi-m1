import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import { User } from "@prisma/client";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";
import { userLogger } from "../utils/logger";

const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            userLogger.error(`User with id ${userId} not found`);
            throw new ApiError(404, "User not found");
        }

        const generateAccessToken = () => {
            return jwt.sign(
                { userId: user.id },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
            );
        };

        const generateRefreshToken = () => {
            return jwt.sign(
                { userId: user.id },
                process.env.REFRESH_TOKEN_SECRET!
            );
        };

        const accessToken = generateAccessToken();
        const refreshToken = generateRefreshToken();
        userLogger.warn(`Access token generated for user with id ${userId} ---> ${accessToken}`);
        return { accessToken, refreshToken };
    } catch (error) {
        const err = error as Error;
        userLogger.info(`Error generating tokens: ${err.message}`);
        throw new ApiError(
            500,
            "Error generating tokens",
            [err.message],
            err.stack
        );
    }
};

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.body.refreshToken;

    if (!incomingRefreshToken) {
        userLogger.info('No refresh token provided, unauthorized request');
        throw new ApiError(400, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        const user = await prisma.user.findFirst({
            where: {
                id: (decodedToken as JwtPayload).userId,
            },
        });

        if (!user) {
            userLogger.info('Refresh token is expired or used');
            throw new ApiError(400, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user.id);

        userLogger.info('Access token refreshed');
        return res.status(200).json(
            new ApiResponse({
                statusCode: 201,
                data: { accessToken, refreshToken },
                message: "Access token refreshed",
            })
        );
    } catch (error) {
        const errorMessage =
            (error as Error).message || "Invalid refresh token";
        userLogger.info(`Error refreshing token: ${errorMessage}`);
        throw new ApiError(400, errorMessage);
    }
});

const pushNotificationToken = asyncHandler(async(req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const { pushToken } = req.body;

    if (!userId) {
        userLogger.info('User not authenticated');
        throw new ApiError(400, "User not authenticated");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {pushToken},
        })

        userLogger.info('Push token updated successfully');
        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                data: true,
                message: 'Push token updated successfully'
            })
        )
    } catch (error) {
        console.error('Erorr updating push token', error);
        userLogger.error('Error updating push token', error);
        throw new ApiError(500, "Error in updating push token")
    }
})

const signIn = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    userLogger.info(`User with email ${email} is trying to log in`);

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (typeof email !== 'string') {
        throw new ApiError(400, "email must be a string");
    }


    // Check if the user exists
    let user = await prisma.user.findUnique({
        where: { email: email },
        include: {
            profile: true
        }
    });

    if (user) {

        // Generate tokens and log in the user
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

        const profileExists = !!user.profile


        const userResponse = {
            ...user,
            accessToken,
            refreshToken,
            profileExists
        } as { [key: string]: any };


        userLogger.info(`User with email ${email} logged in successfully`);
        return res.status(200).json(
            new ApiResponse<typeof userResponse>({
                statusCode: 200,
                data: userResponse,
                message: "User logged in successfully",
            })
        );
    } else {

        const newUser: User = await prisma.user.create({
            data: { email: email },
        });

        if (!newUser) {
            userLogger.error("Error in creating user");
            throw new ApiError(501, "Error in creating user");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser.id);

        const profileExists = false;

        const userResponse = {
            ...newUser,
            accessToken,
            refreshToken,
            profileExists
        } as { [key: string]: any };

        userLogger.info(`User with email ${email} created and logged in successfully`);
        return res.status(201).json(
            new ApiResponse<typeof userResponse>({
                statusCode: 201,
                data: userResponse,
                message: "User created and logged in successfully",
            })
        );
    }
});


export { refreshAccessToken, signIn, pushNotificationToken };