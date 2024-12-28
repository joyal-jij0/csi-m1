import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import { User } from "@prisma/client";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";

const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
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
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
            );
        };

        const accessToken = generateAccessToken();
        const refreshToken = generateRefreshToken();


        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken,
                refreshToken,
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        const err = error as Error;
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
        throw new ApiError(401, "unauthorized request");
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
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user.id);

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
        throw new ApiError(401, errorMessage);
    }
});

const pushNotificationToken = asyncHandler(async(req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const { pushToken } = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {pushToken},
        })

        return res.status(200).json(
            new ApiResponse({
                statusCode: 200,
                data: true,
                message: 'Push token updated successfully'
            })
        )
    } catch (error) {
        console.error('Erorr updating push token', error);
        throw new ApiError(500, "Error in updating push token")
    }
})

const signIn = asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;

    if (!phone) {
        throw new ApiError(400, "Phone and password are required");
    }

    if (typeof phone !== 'string') {
        throw new ApiError(400, "Phone must be a string");
    }


    // Check if the user exists
    let user = await prisma.user.findFirst({
        where: { phone: phone },
    });

    if (user) {

        // Generate tokens and log in the user
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

        user = await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        const userResponse = {
            ...user,
            accessToken,
            refreshToken,
        } as { [key: string]: any };


        return res.status(200).json(
            new ApiResponse<typeof userResponse>({
                statusCode: 200,
                data: userResponse,
                message: "User logged in successfully",
            })
        );
    } else {

        const newUser: User = await prisma.user.create({
            data: { phone: phone },
        });

        if (!newUser) {
            throw new ApiError(501, "Error in creating user");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser.id);

        const userResponse = {
            ...newUser,
            accessToken,
            refreshToken,
        } as { [key: string]: any };

        return res.status(201).json(
            new ApiResponse<typeof userResponse>({
                statusCode: 201,
                data: userResponse,
                message: "User created and logged in successfully",
            })
        );
    }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // Update the user record to clear the refresh token
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            refreshToken: null,
        },
    });

    return res.status(200).json(
        new ApiResponse({
            statusCode: 200,
            data: null,
            message: "User logged out successfully",
        })
    );
});

export {  logoutUser, refreshAccessToken, signIn, pushNotificationToken };