import express from "express";
import {
  createUser,
  getAllUsersWthPagination,
  getCountOfActiveStudents,
  getCountOfAllUserOnTheBasisOfRole,
  searchUsers,
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
userRouter.get("/search/:query", authMiddleware, adminMiddleware, searchUsers);
userRouter.get(
  "/get-role-user-count",
  authMiddleware,
  adminMiddleware,
  getCountOfAllUserOnTheBasisOfRole,
);
userRouter.post("/create", authMiddleware, adminMiddleware, createUser);

export default userRouter;
