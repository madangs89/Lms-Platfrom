import express from "express";
import {
  createDepartment,
  getAllActiveDepartments,
  getAllDepartmentsWithHodsAndStudentsCountAndBranchCount,
  getCountOfActiveDepartments,
  getCountOfDepartmentsActiveAndInactiveAndTotalAndWithHods,
  getDepatmentsWhichDontHaveHod,
  searchDepartments,
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
departmentRouter.get(
  "/departments-without-hod",
  authMiddleware,
  adminMiddleware,
  getDepatmentsWhichDontHaveHod,
);
departmentRouter.get(
  "/search/departments/:query",
  authMiddleware,
  adminMiddleware,
  searchDepartments,
);

export default departmentRouter;
