import express from "express";
import { createUser } from "../controllers/user.controler.js";
const userRouter = express.Router();

// Admin Routes
userRouter.post("/create", createUser);

export default userRouter;
