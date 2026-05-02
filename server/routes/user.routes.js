import express from "express";
import {
  createUser,
  getAllUsersWthPagination,
  getCountOfActiveStudents,
} from "../controllers/user.controler.js";
import { authMiddleware } from "../middlewares/auth.middelware.js";
import { adminMiddleware } from "../middlewares/admin.middelwares.js";
const userRouter = express.Router();

// Admin Routes
userRouter.get(
  "/active-students-count",
  authMiddleware,
  adminMiddleware,
  getCountOfActiveStudents,
);
userRouter.get(
  "/all/:page/:limit/:activeTab",
  authMiddleware,
  adminMiddleware,
  getAllUsersWthPagination,
);
userRouter.post("/create", authMiddleware, adminMiddleware, createUser);

export default userRouter;
