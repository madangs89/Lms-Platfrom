import express from "express";
import { createDepartment } from "../controllers/department.controler.js";
import { adminMiddleware } from "../middlewares/admin.middelwares.js";

const departmentRouter = express.Router();

// Admin Routes
departmentRouter.post("/create", adminMiddleware, createDepartment);

export default departmentRouter;
