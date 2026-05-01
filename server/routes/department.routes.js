import express from "express";
import {
  createDepartment,
  getCountOfActiveDepartments,
} from "../controllers/department.controler.js";
import { adminMiddleware } from "../middlewares/admin.middelwares.js";
import { authMiddleware } from "../middlewares/auth.middelware.js";

const departmentRouter = express.Router();

// Admin Routes
departmentRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createDepartment,
);
departmentRouter.get(
  "/active-departments-count",
  authMiddleware,
  adminMiddleware,
  getCountOfActiveDepartments,
);

export default departmentRouter;
