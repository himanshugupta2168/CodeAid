"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allQuery = exports.createQuery = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importStar(require("zod"));
const prisma = new client_1.PrismaClient();
const query = zod_1.default.object({
    question: (0, zod_1.string)(),
    description: (0, zod_1.string)(),
    user_id: zod_1.default.number().optional(),
});
const createQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedQuery = query.parse(req.body);
        // Optional: Handle the case where user_id is not provided or invalid
        if (!validatedQuery.user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const user = yield prisma.user.findUnique({
            where: {
                user_id: validatedQuery.user_id
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        let room;
        if (user.is_premium && user.validity.getTime() >= Date.now()) {
            // Consider using a more robust method for generating room IDs
            room = `${user.user_id}_${Date.now()}`;
        }
        const queryResponse = yield prisma.query.create({
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
    }
    catch (e) {
        console.error("Error creating query:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.createQuery = createQuery;
const allQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all queries from the database, including related user details excluding the password field
        const response = yield prisma.query.findMany({
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
    }
    catch (e) {
        // Handle errors gracefully
        console.error("Unable to fetch queries:", e);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch queries at the moment",
            error: e.message
        });
    }
});
exports.allQuery = allQuery;
