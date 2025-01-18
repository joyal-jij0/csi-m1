import admin from "../../firebase/setup";
import { PrismaClient } from "@prisma/client";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api"; 
import { ApiError } from "../utils/ApiError";
import { JwtPayload } from "jsonwebtoken";
import {Request, Response} from "express"
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

const isAdminCheck = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isAdmin) {
        throw new ApiError(403, "Access denied. Admins only!");
    }
};

export const sendNotification = async (req: Request, res: Response)=> {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const {title, body} = req.body;

    if(!title || !body){
        throw new ApiError(400, "Title and Body are required") 
    }

    if(typeof title !== "string" || typeof body !== "string"){
        throw new ApiError(400, "Invalid input types")
    }

    try {
        const pushTokens = (await prisma.user.findMany({
            select: {
                pushToken: true,
            },
            }))
            .map(user => user.pushToken)
            .filter(token => token !== null);
    
        if(pushTokens.length < 0){
            throw new ApiError(500, "Can't get any push tokens from DB")
        }
    
        const notification: MulticastMessage = {
            notification: {
                title: title,
                body: body
            },
            tokens: pushTokens,
            android: {
                notification: {
                    priority: "max",
                    visibility: "public"
                }
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            body: body,
                        },
                        "contentAvailable": true,
                    }
                }
            }
        }
    
        console.log(
            "Sending notification:",
            JSON.stringify(notification, null, 2)
        )
    
        const response = await admin
            .messaging()
            .sendEachForMulticast(notification)
    
        console.log("FCM Response:", JSON.stringify(response, null, 2));
    
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(
                        `Failed to send notification to token ${pushTokens[idx]}:`,
                        resp.error
                    );

                    return res.status(207).json(
                        new ApiResponse({
                            statusCode: 207,
                            data: `${res.errored}`,
                            message: `Failed to send notification to token ${pushTokens[idx]}`
                        })
                    )
                } else {
                    console.log(
                        `Successfully sent notification to token ${pushTokens[idx]}`
                    );
                }
            });
        } else {
            console.log("All notifications sent successfully");
        }

        return res.status(201).json(
            new ApiResponse({
                statusCode: 201,
                data: "All notifications sent successfully",
                message: "All notifications sent successfully"
            })
        )
    } catch (error: any) {
        console.error('Error in sending notifications', error);
        throw new ApiError(400, error)
    }

}