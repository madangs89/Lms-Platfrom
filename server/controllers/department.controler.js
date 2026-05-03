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

export const getAllActiveDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      departments,
      success: true,
      message: "Departments retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getCountOfActiveDepartments = async (req, res) => {
  try {
    // need to handle caching here
    const count = await prisma.department.count({
      where: {
        is_active: true,
      },
    });

    return res.status(200).json({
      count,
      success: true,
      message: "Count of active departments retrieved successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({
        message: "Bad request: " + error.message,
        success: false,
      });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getSingleDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Department ID is required",
        success: false,
      });
    }
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        success: false,
      });
    }
    return res.status(200).json({
      department,
      success: true,
      message: "Department retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Department ID is required",
        success: false,
      });
    }
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        success: false,
      });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { is_active: !department.is_active },
    });

    return res.status(200).json({
      department: updatedDepartment,
      success: true,
      message: `Department active status toggled successfully. Toggled To ${updatedDepartment.is_active ? "Active" : "Inactive"}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
