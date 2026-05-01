import express from "express";
import { login, me } from "../controllers/auth.controler.js";
import { authMiddleware } from "../middlewares/auth.middelware.js";

const authRouter = express.Router();

authRouter.get("/me", authMiddleware, me);
authRouter.post("/login", login);

export default authRouter;
