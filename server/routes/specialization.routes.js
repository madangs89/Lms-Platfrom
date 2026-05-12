import express from "express";
import { authMiddleware } from "../middlewares/auth.middelware.js";
import { adminMiddleware } from "../middlewares/admin.middelwares.js";
import { specializationDetailsForBranch } from "../controllers/specializtion.controler.js";

const specializationRouter = express.Router();

specializationRouter.get(
  "/modal/branch/:id",
  authMiddleware,
  adminMiddleware,
  specializationDetailsForBranch,
);

export default specializationRouter;
