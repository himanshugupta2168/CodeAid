import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import z from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
// Load environment variables
config();

const prisma = new PrismaClient();

// Zod schema for user details validation
const userDetails = z.object({
    fullName: z.string(),
    username: z.string().email(),
    password: z.string().min(9),
    is_premium: z.boolean().optional()
});

// Define types for user details inferred from Zod schema
type UserType = z.infer<typeof userDetails>;

export const signUpController = async (req: Request, res: Response) => {
    try {
        const validatedUser: UserType = userDetails.parse(req.body);

        // Create a new user in the database
        const salts = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(validatedUser.password, salts);

        const newUser = await prisma.user.create({
            data: {
                fullName: validatedUser.fullName,
                username: validatedUser.username,
                password: hash,
                is_premium: validatedUser.is_premium || false,
                forgetPassword: "", // Changed from forgetPassword
                validity: new Date()
            }
        });

        const token = jwt.sign({ user_id: newUser.user_id, is_premium: newUser.is_premium }, process.env.JWT_SECRET || "");

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            token: token
        });
    } catch (e) {
        console.error("Error in creating user:", e);
        return res.status(500).json({
            success: false,
            message: "Error in creating user"
        });
    }
};

export const signInController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body as { username: string, password: string };

        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ user_id: user.user_id , is_premium:user.is_premium}, process.env.JWT_SECRET || "");

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token
        });
    } catch (e) {
        console.error("Internal server error:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const sendForgetPasswordMail = async (email: string, token: string) => {
    // Implement logic to send the email
};

export const fogetPasswordLinkSender = async (req: Request, res: Response) => {
    try {
        const { username } = req.body as { username: string };

        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cryptoToken = crypto.randomBytes(32).toString("hex");
        const jwtToken = jwt.sign({ token: cryptoToken }, process.env.JWT_SECRET || "", {
            expiresIn: "5m"
        });

        await prisma.user.update({
            where: {
                username: username
            },
            data: {
                forgetPassword: jwtToken,
            }
        });

        await sendForgetPasswordMail(username, jwtToken);

        return res.status(200).json({
            success: true,
            message: "Reset Password Mail sent"
        });
    } catch (e) {
        console.error("Internal server error:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
