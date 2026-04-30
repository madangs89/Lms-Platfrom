import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const createDepartment = async (req, res) => {
  try {
    let { name, code } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    name = name.trim().toUpperCase();
    code = code.trim().toUpperCase();
    const department = await prisma.department.create({
      data: {
        name,
        code,
      },
    });
    if (!department) {
      return res
        .status(500)
        .json({ message: "Failed to create department", success: false });
    }

    return res.status(201).json({
      department,
      success: true,
      message: "Department created successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const fields = error.meta?.target || [];

        let message = "Duplicate value";

        if (fields.includes("name")) {
          message = "Department name already exists";
        } else if (fields.includes("code")) {
          message = "Department code already exists";
        }

        return res.status(400).json({
          message,
          success: false,
        });
      }

      if (error.code === "P2003") {
        return res.status(400).json({
          message: "Invalid foreign key value: " + error.meta.field_name,
          success: false,
        });
      }
    }
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
