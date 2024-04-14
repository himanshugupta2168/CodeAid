import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token available" });
        }

        const key = token.split("_").splice(1).join("_");
        const decodedToken = await jwt.verify(key, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

        req.body.user_id = decodedToken.user_id;
        req.body.is_premium= decodedToken.is_premium;
        console.log(req.body);
        next();
    } catch (error:any) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
