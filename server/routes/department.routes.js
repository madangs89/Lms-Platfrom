import express from "express";
import {
  createDepartment,
  getAllActiveDepartments,
  getAllDepartmentsWithHodsAndStudentsCountAndBranchCount,
  getCountOfActiveDepartments,
  getCountOfDepartmentsActiveAndInactiveAndTotalAndWithHods,
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
departmentRouter.get(
  "/active-departments",
  authMiddleware,
  adminMiddleware,
  getAllActiveDepartments,
);
departmentRouter.get(
  "/active-departments-hods-students-branches/:is_active/:page/:limit",
  authMiddleware,
  adminMiddleware,
  getAllDepartmentsWithHodsAndStudentsCountAndBranchCount,
);
departmentRouter.get(
  "/department-counts-total-active-inactive-with-hods",
  authMiddleware,
  adminMiddleware,
  getCountOfDepartmentsActiveAndInactiveAndTotalAndWithHods,
);

export default departmentRouter;
