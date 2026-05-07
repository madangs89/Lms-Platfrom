import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const createDepartment = async (req, res) => {
  try {
    let { name, code, hod_id, status = "active" } = req.body;

    if (!name || !code || !hod_id) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    if (!req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: User information is missing in the request",
        success: false,
      });
    }

    name = name.trim().toUpperCase();
    code = code.trim().toUpperCase();

    let is_active = true;
    if (status == "active") {
      is_active = true;
    } else if (status == "inactive") {
      is_active = false;
    }

    const isAlreadyHod = await prisma.department.findFirst({
      where: {
        hod_id,
      },
    });

    if (isAlreadyHod) {
      return res.status(400).json({
        message: "This user is already a HOD of another department",
        success: false,
      });
    }

    const [newDepartment] = await prisma.$transaction([
      prisma.department.create({
        data: {
          name,
          code,
          hod_id,
          is_active,
        },
      }),

      prisma.user.update({
        where: { id: hod_id },
        data: {
          roles: {
            create: {
              role: "hod",
              granted_by: req.user.id,
            },
          },
        },
      }),
    ]);
    return res.status(201).json({
      department: newDepartment,
      success: true,
      message: "Department created successfully",
    });
  } catch (error) {
    console.log(error);

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

// This is for table
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
      total: Number(total),
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

// This is used in department page
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

// This is used in department details page for modal
export const getSingleDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Department ID is required",
        success: false,
      });
    }

    const [department, facultyCount, studentCount] = await Promise.all([
      prisma.department.findUnique({
        where: { id },

        select: {
          id: true,
          name: true,
          code: true,
          is_active: true,
          hod_id: true,
          created_at: true,
          updated_at: true,

          hod: {
            select: {
              id: true,
              name: true,
              email: true,
              employee_id: true,

              roles: {
                select: {
                  role: true,
                },
              },
            },
          },

          branches: {
            select: {
              id: true,
              name: true,
              department_id: true,
              is_active: true,
              code: true,

              _count: {
                select: {
                  specializations: true,
                },
              },
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          department_id: id,

          roles: {
            some: {
              role: "faculty",
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          department_id: id,

          roles: {
            some: {
              role: "student",
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      department: {
        ...department,
        facultyCount,
        studentCount,
      },
      success: true,
      message: "Department retrieved successfully",
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Searching departments by name or code
export const searchDepartments = async (req, res) => {
  try {
    const { query } = req.params;

    console.log(query);

    if (!query.trim()) {
      return res.status(400).json({
        message: "Search query is required",
        success: false,
      });
    }
    const departments = await prisma.department.findMany({
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
        ],
      },
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
    });

    // Get student count for each department
    const departmentIds = departments.map((dept) => dept.id);
    const studentCounts = await prisma.user.groupBy({
      by: ["department_id"],
      where: {
        department_id: {
          in: departmentIds,
        },
        roles: {
          some: {
            role: "student",
          },
        },
      },
      _count: {
        _all: true,
      },
    });

    const studentCountMap = Object.fromEntries(
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
      success: true,
      message: "Departments searched successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, is_active } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Department ID is required",
        success: false,
      });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { name, code, is_active },
    });

    return res.status(200).json({
      department: updatedDepartment,
      success: true,
      message: "Department updated successfully",
    });
  } catch (error) {
    console.log(error);

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
      } else if (error.code === "P2003") {
        return res.status(400).json({
          message: "Invalid foreign key value: " + error.meta.field_name,
          success: false,
        });
      } else if (error.code === "P2025") {
        return res.status(404).json({
          message: "Department not found",
          success: false,
        });
      }
    }
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const assignOrChangeHod = async (req, res) => {
  try {
    const { departmentId, oldHod_id, newHod_id } = req.body;

    if (!departmentId) {
      return res.status(400).json({
        message: "Department ID is required",
        success: false,
      });
    }

    if (!newHod_id) {
      return res.status(400).json({
        message: "New HOD ID is required",
        success: false,
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Prevent same HOD replacement
    if (oldHod_id && oldHod_id === newHod_id) {
      return res.status(400).json({
        message: "Old HOD and New HOD cannot be same",
        success: false,
      });
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },

      select: {
        id: true,
        hod_id: true,
      },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        success: false,
      });
    }

    const newHodUser = await prisma.user.findUnique({
      where: { id: newHod_id },

      select: {
        id: true,
      },
    });

    if (!newHodUser) {
      return res.status(404).json({
        message: "New HOD user not found",
        success: false,
      });
    }

    const alreadyHod = await prisma.department.findFirst({
      where: {
        hod_id: newHod_id,
        NOT: {
          id: departmentId,
        },
      },

      select: {
        id: true,
        name: true,
      },
    });

    if (alreadyHod) {
      return res.status(400).json({
        message: `User is already HOD of ${alreadyHod.name}`,
        success: false,
      });
    }

    if (!oldHod_id) {
      // Department already has HOD
      if (department.hod_id) {
        return res.status(400).json({
          message:
            "Department already has a HOD assigned. Use change HOD instead.",
          success: false,
        });
      }

      const result = await prisma.$transaction(async (tx) => {
        // Update department
        const updatedDepartment = await tx.department.update({
          where: {
            id: departmentId,
          },

          data: {
            hod_id: newHod_id,
          },
        });

        // Check role already exists
        const existingHodRole = await tx.userRoles.findFirst({
          where: {
            user_id: newHod_id,
            role: "hod",
          },
        });

        // Create only if not exists
        if (!existingHodRole) {
          await tx.userRoles.create({
            data: {
              user_id: newHod_id,
              role: "hod",
              granted_by: req.user.id,
            },
          });
        }

        return updatedDepartment;
      });

      return res.status(200).json({
        success: true,
        message: "HOD assigned successfully",
        department: result,
      });
    }

    const oldHodUser = await prisma.user.findUnique({
      where: {
        id: oldHod_id,
      },

      select: {
        id: true,
      },
    });

    if (!oldHodUser) {
      return res.status(404).json({
        message: "Old HOD user not found",
        success: false,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update department
      const updatedDepartment = await tx.department.update({
        where: {
          id: departmentId,
        },

        data: {
          hod_id: newHod_id,
        },
      });

      // Remove old HOD role
      await tx.userRoles.deleteMany({
        where: {
          user_id: oldHod_id,
          role: "hod",
        },
      });

      // Check if new HOD role exists
      const existingHodRole = await tx.userRoles.findFirst({
        where: {
          user_id: newHod_id,
          role: "hod",
        },
      });

      // Create role only if not exists
      if (!existingHodRole) {
        await tx.userRoles.create({
          data: {
            user_id: newHod_id,
            role: "hod",
            granted_by: req.user.id,
          },
        });
      }

      return updatedDepartment;
    });

    return res.status(200).json({
      success: true,
      message: "HOD changed successfully",
      department: result,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint
      if (error.code === "P2002") {
        return res.status(400).json({
          message: "Duplicate value found",
          success: false,
        });
      }

      // Foreign key constraint
      if (error.code === "P2003") {
        return res.status(400).json({
          message: "Invalid foreign key reference",
          success: false,
        });
      }

      // Record not found
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Record not found",
          success: false,
        });
      }

      // Transaction conflict
      if (error.code === "P2034") {
        return res.status(400).json({
          message: "Transaction failed due to concurrent update",
          success: false,
        });
      }
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
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
