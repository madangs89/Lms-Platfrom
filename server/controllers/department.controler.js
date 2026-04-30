import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
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
        return res.status(400).json({
          message:
            "Department with this name or code already exists : " +
            error.meta.target.join(", "),
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
