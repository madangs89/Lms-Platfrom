import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

// This is for getting count of branches with total active inactive specializations count for dashboard stats
// Used in AdminBranches.jsx for fetching data for metric cards
export const getCountOfBranchesWithTotalActiveInactiveSpecializationsCount =
  async (req, res) => {
    try {
      const [
        totalBranches,
        activeBranches,
        inactiveBranches,
        totalSpecializations,
      ] = await Promise.all([
        prisma.branch.count(),
        prisma.branch.count({
          where: {
            is_active: true,
          },
        }),
        prisma.branch.count({
          where: {
            is_active: false,
          },
        }),
        prisma.specialization.count(),
      ]);
      return res.status(200).json({
        totalBranches,
        activeBranches,
        inactiveBranches,
        totalSpecializations,
        success: true,
        message: "Count of branches retrieved successfully",
      });
    } catch (error) {
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res
            .status(400)
            .json({ message: "Bad request", error: error.message });
        } else if (error.code === "P2025") {
          return res
            .status(404)
            .json({ message: "Not found", error: error.message });
        }
        return res
          .status(400)
          .json({ message: "Bad request", error: error.message });
      }

      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

export const createBranch = async (req, res) => {
  try {
    let { name, code, department_id, is_active = true } = req.body;

    if (!name || !code || !department_id) {
      return res.status(400).json({
        success: false,
        message: "Name, code and department_id are required",
      });
    }

    name = name.trim();
    code = code.trim().toUpperCase();

    const newBranch = await prisma.branch.create({
      data: {
        name,
        code,
        department_id,
        is_active: Boolean(is_active),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message:
            "Branch code already exists or branch name already exists in this department",
        });
      }

      if (error.code === "P2003") {
        return res.status(400).json({
          success: false,
          message: "Selected department does not exist",
        });
      }

      if (error.code === "P2000") {
        return res.status(400).json({
          success: false,
          message: "Name or code exceeds allowed length",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
