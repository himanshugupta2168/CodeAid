import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import z, { ZodNumber, boolean, date, string } from "zod"
const prisma = new PrismaClient();

const query=z.object({
    question:string(),
    description:string(),
    user_id:z.number().optional(),
})
type queryType = z.infer<typeof query>;

export const createQuery = async (req: Request, res: Response) => {
    try {
        const validatedQuery: queryType = query.parse(req.body);

        // Optional: Handle the case where user_id is not provided or invalid
        if (!validatedQuery.user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                user_id:validatedQuery.user_id
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let room: string | undefined;
        if (user.is_premium && user.validity.getTime() >= Date.now()) {
            // Consider using a more robust method for generating room IDs
            room = `${user.user_id}_${Date.now()}`;
        }

        const queryResponse = await prisma.query.create({
            data: {
                question: validatedQuery.question,
                description: validatedQuery.description,
                room_id: room || "", // Optional: Ensure room_id is set to an empty string if room is undefined
                ownerId: user.user_id // Use the actual user_id from the database
            }
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Query created successfully",
            data: queryResponse
        });
    } catch (e) {
        console.error("Error creating query:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const allQuery = async (req: Request, res: Response) => {
    try {
        // Fetch all queries from the database, including related user details excluding the password field
        const response = await prisma.query.findMany({
            include: {
                owner: {
                    // Include specific fields of the owner excluding the password field
                    select: {
                        user_id: true,
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Queries fetched successfully",
            data: response
        });
    } catch (e:any) {
        // Handle errors gracefully
        console.error("Unable to fetch queries:", e);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch queries at the moment",
            error: e.message
        });
    }
};
