import express from "express";
import {
  createUser,
  getAllUsersWthPagination,
  getCountOfActiveStudents,
  getCountOfAllUserOnTheBasisOfRole,
  searchFacultyOnly,
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
  "/search/faculty-only/:query",
  authMiddleware,
  adminMiddleware,
  searchFacultyOnly,
);
userRouter.get(
  "/get-role-user-count",
  authMiddleware,
  adminMiddleware,
  getCountOfAllUserOnTheBasisOfRole,
);
userRouter.post("/create-user", authMiddleware, adminMiddleware, createUser);

export default userRouter;
