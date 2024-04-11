import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import z from "zod";
import bcrypt from "bcrypt"
import crypto from "crypto"
import router from "../Routes/userRoutes";
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
                forgetPassword:"",
                validity:new Date()
            }
        });
        const token = jwt.sign({user_id:newUser.user_id}, process.env.JWT_SECRET ||" ");
        return res.status(200).json({
            success:true, 
            message:"User Created Successfully",
            token:token
        })
    } catch (e:any) {
        return res.status(500).json({
            success:false, 
            message:"Error in creating user",
            error: e.message
        })
    }
};


export const signInController =async(req:Request, res:Response)=>{
    try{
        const validatedUser:UserType= userDetails.parse(req.body());
        const user = await prisma.user.findUnique({
            where:{
                username:validatedUser.username,
            }
        })
        if (!user) return res.status(404).json({
            success:false,
            message:"User not found",
            error:"No user with the given details"
        })
        const verifiedUser = await bcrypt.compare(validatedUser.password, user.password);
        if (!verifiedUser) return res.status(401).json({
            success:false,
            message:"Invalid password", 
            error:"Invalid password"
        })
        const token = jwt.sign({user_id:user.user_id}, process.env.JWT_SECRET||" ");
        return res.status(200).json({
            success:true, 
            message:"User logged in successfully", 
            token :token
        })
    }
    catch(e:any){
        return res.status(500).json({
            success:false, 
            message:"Internal server error ", 
            error: e.message,
        })
    }
}

 const sendForgetPasswordMail=async (email:string, token:string)=>{
// need to implement the logic to send the mail 
 
}

export const fogetPasswordLinkSender =async(req:Request, res:Response)=>{
    try{
        const username= req.body();
        const user = await prisma.user.findUnique({
            where:{
                username:username,
            }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const cryptoToken = await crypto.randomBytes(32).toString("hex")
        const jwtToken = jwt.sign({token:cryptoToken},process.env.JWT_SECRET ||" ", {
            expiresIn:"5m"
        })
        const updateUser = await prisma.user.update({
            where:{
                username:username
            },
            data:{
                forgetPassword:jwtToken,
            }
        })
        await sendForgetPasswordMail(username, jwtToken);
        return res.status(200).json({
            success:true, 
            message:"Reset Password Mail sent"
        });
    }
    catch(e:any){
        return res.status(500).json({
            success:false, 
            message:"Internal server error", 
            error:e.message
        })
    }
}