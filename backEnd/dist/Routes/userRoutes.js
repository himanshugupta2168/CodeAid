"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const userControllers_1 = require("../Controllers/userControllers");
router.post("/signup", userControllers_1.signUpController);
router.post("/signin", userControllers_1.signInController);
router.patch("/forgetPassword", userControllers_1.fogetPasswordLinkSender);
exports.default = router;
