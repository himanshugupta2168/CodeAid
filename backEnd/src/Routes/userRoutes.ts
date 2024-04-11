import express from "express"
import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient()
const router = express.Router();
import { signUpController, signInController} from "../Controllers/userControllers";
router.post("/signup",signUpController)
router.post("/signin", signInController)
router.patch("/forgetPassword", ()=>{})
export default router