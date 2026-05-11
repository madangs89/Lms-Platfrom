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

// This is for Table in AdminBranches.jsx for fetching branches with pagination, filtering by active status and department, and including count of specializations for each branch
// Used in AdminBranches.jsx for fetching data for table with pagination, filtering and count of specializations for each branch
export const getAllBranchesWithNameCodeDepartmentSpecializationCountStatus =
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        active = "active",
        department = "all",
      } = req.params;

      const offset = (page - 1) * parseInt(limit);
      const whereClause = {};

      if (active === "active") {
        whereClause.is_active = true;
      } else if (active === "inactive") {
        whereClause.is_active = false;
      }

      if (department !== "all") {
        whereClause.department_id = department;
      }

      const [branches, totalCount] = await Promise.all([
        prisma.branch.findMany({
          where: whereClause,
          take: parseInt(limit),
          skip: parseInt(offset),
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
            name: true,
            code: true,
            is_active: true,
            created_at: true,
            updated_at: true,
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            _count: {
              select: {
                specializations: true,
              },
            },
          },
        }),
        prisma.branch.count({ where: whereClause }),
      ]);

      return res.status(200).json({
        branches,
        totalCount,
        success: true,
        message: "Branches retrieved successfully",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res
          .status(400)
          .json({ message: "Bad request", error: error.message });
      }
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

export const searchBranch = async (req, res) => {
  try {
    let { query } = req.params;
    query = query.trim();
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query cannot be empty",
      });
    }

    const branches = await prisma.branch.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            department: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            department: {
              code: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });

    return res.status(200).json({
      branches,
      success: true,
      message: "Branches retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBranchDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Branch id is required",
      });
    }

    const [
      branch,
      specializations,
      activeBatchesCount,
      totalStudentsCount,
      totalSectionsCount,
      facultyMappings,
    ] = await Promise.all([
      // Branch Details
      prisma.branch.findUnique({
        where: { id },

        select: {
          id: true,
          name: true,
          code: true,
          is_active: true,
          created_at: true,
          updated_at: true,

          department: {
            select: {
              id: true,
              name: true,
              code: true,
              is_active: true,
              created_at: true,
              updated_at: true,
            },
          },

          _count: {
            select: {
              specializations: true,
            },
          },
        },
      }),

      // Specializations + subject counts
      prisma.specialization.findMany({
        where: {
          branch_id: id,
        },

        select: {
          id: true,

          _count: {
            select: {
              subjects: true,
            },
          },
        },
      }),

      // Active batches count
      prisma.batches.count({
        where: {
          branch_id: id,
          is_active: true,
        },
      }),

      // Total students count
      prisma.studentAcademicStatus.count({
        where: {
          is_active: true,

          batch: {
            branch_id: id,
          },
        },
      }),

      // Total sections count
      prisma.sections.count({
        where: {
          batch: {
            branch_id: id,
            is_active: true,
          },
        },
      }),

      // Distinct faculty mappings
      prisma.facultySpecializationMap.findMany({
        where: {
          is_active: true,

          specialization: {
            branch_id: id,
          },
        },

        distinct: ["faculty_id"],

        select: {
          faculty_id: true,
        },
      }),
    ]);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // Total subjects count
    const totalSubjectsCount = specializations.reduce((acc, specialization) => {
      return acc + specialization._count.subjects;
    }, 0);

    // Total faculty count
    const totalFacultyCount = facultyMappings.length;

    return res.status(200).json({
      success: true,

      data: {
        id: branch.id,
        name: branch.name,
        code: branch.code,
        is_active: branch.is_active,
        created_at: branch.created_at,
        updated_at: branch.updated_at,

        department: branch.department,

        statistics: {
          totalSpecializations: branch._count.specializations,
          totalSubjects: totalSubjectsCount,
          activeBatches: activeBatchesCount,
          totalStudents: totalStudentsCount,
          totalFaculty: totalFacultyCount,
          totalSections: totalSectionsCount,
        },
      },
    });
  } catch (error) {
    console.log("Get Branch Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
