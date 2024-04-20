"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fogetPasswordLinkSender = exports.signInController = exports.signUpController = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
// Load environment variables
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
// Zod schema for user details validation
const userDetails = zod_1.default.object({
    fullName: zod_1.default.string(),
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(9),
    is_premium: zod_1.default.boolean().optional()
});
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedUser = userDetails.parse(req.body);
        // Create a new user in the database
        const salts = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(validatedUser.password, salts);
        const newUser = yield prisma.user.create({
            data: {
                fullName: validatedUser.fullName,
                username: validatedUser.username,
                password: hash,
                is_premium: validatedUser.is_premium || false,
                forgetPassword: "", // Changed from forgetPassword
                validity: new Date()
            }
        });
        const token = jsonwebtoken_1.default.sign({ user_id: newUser.user_id, is_premium: newUser.is_premium }, process.env.JWT_SECRET || "");
        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            token: token
        });
    }
    catch (e) {
        console.error("Error in creating user:", e);
        return res.status(500).json({
            success: false,
            message: "Error in creating user"
        });
    }
});
exports.signUpController = signUpController;
const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma.user.findUnique({
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
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id, is_premium: user.is_premium }, process.env.JWT_SECRET || "");
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token
        });
    }
    catch (e) {
        console.error("Internal server error:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.signInController = signInController;
const sendForgetPasswordMail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement logic to send the email
});
const fogetPasswordLinkSender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const user = yield prisma.user.findUnique({
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
        const cryptoToken = crypto_1.default.randomBytes(32).toString("hex");
        const jwtToken = jsonwebtoken_1.default.sign({ token: cryptoToken }, process.env.JWT_SECRET || "", {
            expiresIn: "5m"
        });
        yield prisma.user.update({
            where: {
                username: username
            },
            data: {
                forgetPassword: jwtToken,
            }
        });
        yield sendForgetPasswordMail(username, jwtToken);
        return res.status(200).json({
            success: true,
            message: "Reset Password Mail sent"
        });
    }
    catch (e) {
        console.error("Internal server error:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.fogetPasswordLinkSender = fogetPasswordLinkSender;
