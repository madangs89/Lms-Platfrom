import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

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
