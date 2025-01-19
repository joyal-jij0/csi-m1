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
        console.log("Access Token generated: ",accessToken)

        // await prisma.user.update({
        //     where: {
        //         id: user.id,
        //     },
        //     data: {
        //         accessToken,
        //         refreshToken,
        //     }
        // });
        console.log("Access Token generated: ", accessToken)
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
            throw new ApiError(400, "Refresh token is expired or used");
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
        throw new ApiError(400, errorMessage);
    }
});

const pushNotificationToken = asyncHandler(async(req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const { pushToken } = req.body;

    if (!userId) {
        throw new ApiError(400, "User not authenticated");
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
    const { email } = req.body;

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

        // user = await prisma.user.update({
        //     where: { id: user.id },
        //     data: { refreshToken },
        //     include: {
        //         profile: true
        //     }
        // });

        const profileExists = !!user.profile;

        const userResponse = {
            ...user,
            accessToken,
            refreshToken,
            profileExists,
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
            data: { email: email },
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
        throw new ApiError(400, "User not authenticated");
    }

    // Update the user record to clear the refresh token
    // await prisma.user.update({
    //     where: {
    //         id: userId,
    //     },
    //     data: {
    //         refreshToken: null,
    //         accessToken: null,
    //     },
    // });

    return res.status(200).json(
        new ApiResponse({
            statusCode: 200,
            data: null,
            message: "User logged out successfully",
        })
    );
});

export {  logoutUser, refreshAccessToken, signIn, pushNotificationToken };