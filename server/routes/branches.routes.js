import express from "express";
import {
  createBranch,
  getAllBranchesWithNameCodeDepartmentSpecializationCountStatus,
  getBranchDetailsById,
  getCountOfBranchesWithTotalActiveInactiveSpecializationsCount,
  searchBranch,
  updateBranch,
  updateDepartmentForBrach,
} from "../controllers/branches.controler.js";
import { authMiddleware } from "../middlewares/auth.middelware.js";
import { adminMiddleware } from "../middlewares/admin.middelwares.js";

const branchRouter = express.Router();

branchRouter.get(
  "/branches-counts-total-active-inactive-specializations",
  authMiddleware,
  adminMiddleware,
  getCountOfBranchesWithTotalActiveInactiveSpecializationsCount,
);
branchRouter.get(
  "/branches-with-name-code-department-specialization-count-status/:page/:limit/:active/:department",
  authMiddleware,
  adminMiddleware,
  getAllBranchesWithNameCodeDepartmentSpecializationCountStatus,
);
branchRouter.get(
  "/search/branch/:query",
  authMiddleware,
  adminMiddleware,
  searchBranch,
);
branchRouter.get(
  "/single-branch/info/:id",
  authMiddleware,
  adminMiddleware,
  getBranchDetailsById,
);

// All Post Requests
branchRouter.post("/create", authMiddleware, adminMiddleware, createBranch);

// update request
branchRouter.patch(
  "/update/info/:id",
  authMiddleware,
  adminMiddleware,
  updateBranch,
);
branchRouter.patch(
  "/update/department",
  authMiddleware,
  adminMiddleware,
  updateDepartmentForBrach,
);

export default branchRouter;
