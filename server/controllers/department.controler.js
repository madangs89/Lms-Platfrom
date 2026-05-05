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

export const getAllDepartmentsWithHodsAndStudentsCountAndBranchCount = async (
  req,
  res,
) => {
  try {
    const { is_active = "active", page = 1, limit = 10 } = req.params;

    const skip = (page - 1) * limit;

    let whereCondition = {};

    if (is_active === "active") {
      whereCondition.is_active = true;
    } else if (is_active === "inactive") {
      whereCondition.is_active = false;
    }

    let [departments, studentCounts, total] = await prisma.$transaction([
      // 1. Departments + HOD + branch count
      prisma.department.findMany({
        where: whereCondition,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          code: true,
          is_active: true,
          hod_id: true,

          hod: {
            select: {
              name: true,
              email: true,
              id: true,
              roles: {
                select: {
                  role: true,
                },
              },
            },
          },

          _count: {
            select: {
              branches: true,
            },
          },
        },
      }),

      // 2. Student count per department
      prisma.user.groupBy({
        by: ["department_id"],
        where: {
          roles: {
            some: {
              role: "student",
            },
          },
        },
        _count: {
          _all: true,
        },
      }),

      // 3. Total count for pagination
      prisma.department.count({
        where: whereCondition,
      }),
    ]);

    let studentCountMap = Object.fromEntries(
      studentCounts.map((item) => [item.department_id, item._count._all]),
    );

    const result = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      is_active: dept.is_active,
      hod_id: dept.hod_id,
      hod:
        {
          name: dept.hod?.name,
          email: dept.hod?.email,
          id: dept.hod?.id,
          roles: dept.hod?.roles.map((r) => r.role) || [],
        } || null,
      branchCount: dept._count.branches,
      studentCount: studentCountMap[dept.id] || 0,
    }));

    return res.status(200).json({
      result,
      total:Number(total),
      totalPages: Math.ceil(Number(total) / Number(limit)),
      success: true,
      message: "Departments retrieved successfully",
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getCountOfDepartmentsActiveAndInactiveAndTotalAndWithHods = async (
  req,
  res,
) => {
  try {
    const [activeCount, inactiveCount, totalCount, withHodCount] =
      await prisma.$transaction([
        prisma.department.count({
          where: { is_active: true },
        }),

        prisma.department.count({
          where: { is_active: false },
        }),

        prisma.department.count(),

        prisma.department.count({
          where: {
            hod_id: {
              not: null,
            },
          },
        }),
      ]);

    return res.status(200).json({
      activeCount,
      inactiveCount,
      totalCount,
      withHodCount,
      success: true,
      message: "Department counts retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getDepatmentsWhichDontHaveHod = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
        hod_id: null,
      },
    });
    return res.status(200).json({
      departments,
      success: true,
      message: "Departments without HOD retrieved successfully",
    });
  } catch (error) {
    console.log(error);
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
