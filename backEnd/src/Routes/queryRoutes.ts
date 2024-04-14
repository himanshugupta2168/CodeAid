import express  from "express";
import { Authenticate } from "../Middlewares/authMiddleware";
import { createQuery, allQuery } from "../Controllers/queryController";
const router = express.Router()
router.use(Authenticate)


// write a function to get all queries
router.get("/", allQuery)

// function to view specific query 
router.post("/create", createQuery);
// function to create a query 

// function to create a comment 


export default router;