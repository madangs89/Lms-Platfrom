import express from "express";
import { getCountOfBranchesWithTotalActiveInactiveSpecializationsCount } from "../controllers/branches.controler.js";
import { authMiddleware } from "../middlewares/auth.middelware.js";
import { adminMiddleware } from "../middlewares/admin.middelwares.js";

const branchRouter = express.Router();

branchRouter.get(
  "/branches-counts-total-active-inactive-specializations",
  authMiddleware,
  adminMiddleware,
  getCountOfBranchesWithTotalActiveInactiveSpecializationsCount,
);

export default branchRouter;
