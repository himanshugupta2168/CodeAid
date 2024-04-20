"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queryController_1 = require("../Controllers/queryController");
const router = express_1.default.Router();
// router.use(Authenticate)
// write a function to get all queries
router.get("/", queryController_1.allQuery);
// function to view specific query 
router.post("/create", queryController_1.createQuery);
// function to create a query 
// function to create a comment
exports.default = router;
