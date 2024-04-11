import express from "express"
import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient()
const router = express.Router();
router.post("/signup", async(req, res)=>{
    await prisma.user.create({
        data:{
            username:"test5"
        }
    })
    return res.json({message:"user tested successfully"});
})
router.post("/signin", ()=>{})
router.patch("/forgetPassword", ()=>{})
router.get("/", async(req, res)=>{
    return res.send("hello from auth")
})
export default router