import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

const ALLOWED_ROLES = ["student", "faculty", "hod", "admin"];
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department_id,
      role,
      usn,
      employee_id,
      status,
      hod_department_id,
    } = req.body;

    if (!name || !email || !password || !department_id || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, email, password, department_id, and role are required.",
      });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    if (role === "hod" && !hod_department_id) {
      return res.status(400).json({
        success: false,
        message: "HOD role requires hod_department_id field.",
      });
    }
    if (role == "student" && !usn) {
      return res.status(400).json({
        success: false,
        message: "Student role requires usn field.",
      });
    }
    if ((role == "faculty" || role == "hod") && !employee_id) {
      return res.status(400).json({
        success: false,
        message: "Faculty and HOD roles require employee_id field.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "hod") {
      const checkAlreadyDepartmentHavingHod =
        await prisma.department.findUnique({
          where: {
            id: hod_department_id,
          },
        });
      if (!checkAlreadyDepartmentHavingHod) {
        return res.status(400).json({
          success: false,
          message: "Invalid hod_department_id",
        });
      }
      if (checkAlreadyDepartmentHavingHod.hod_id) {
        return res.status(400).json({
          success: false,
          message: "This department already has a HOD assigned",
        });
      }

      let user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name,
            email,
            password_hash: hashedPassword,
            phone: phone || null,
            department_id,
            usn: usn || null,
            employee_id: employee_id || null,
            status: status || "active",
            roles: {
              create: {
                role: role,
              },
            },
          },
        });
        await tx.department.update({
          where: { id: hod_department_id },
          data: { hod_id: newUser.id },
        });
        return newUser;
      });
      const { password_hash, ...safeUser } = user;
      return res.status(201).json({
        user: safeUser,
        success: true,
        message: "HOD user created and assigned to department successfully.",
      });
    }

    let [user] = await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email,
          password_hash: hashedPassword,
          phone: phone || null,
          department_id,
          usn: usn || null,
          employee_id: employee_id || null,
          status: status || "active",
          roles: {
            create: {
              role: role,
            },
          },
        },
      }),
    ]);
    let { password_hash, ...safeUser } = user;
    return res.status(201).json({
      user: safeUser,
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          success: false,
          message: `Duplicate value for field: ${error.meta?.target}`,
        });
      }

      // Foreign key constraint failed
      if (error.code === "P2003") {
        return res.status(400).json({
          success: false,
          message: "Invalid department_id or related reference",
        });
      }
    }

    // Validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    // Fallback
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCountOfActiveStudents = async (req, res) => {
  try {
    const count = await prisma.user.count({
      where: {
        status: "active",
        roles: {
          some: {
            role: "student",
          },
        },
      },
    });
    return res.status(200).json({
      count,
      success: true,
      message: "Count of active students retrieved successfully",
    });
  } catch (error) {
    console.log(error);

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

export const getAllUsersWthPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10, activeTab } = req.params;
    const offset = (page - 1) * limit;

    if (
      activeTab &&
      !["student", "faculty", "hod", "admin", "all"].includes(activeTab)
    ) {
      return res.status(400).json({
        message: "Invalid activeTab value",
        success: false,
      });
    }

    if (activeTab === "all") {
      const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
          skip: offset,
          take: parseInt(limit),
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            usn: true,
            employee_id: true,
            phone: true,
            roles: {
              select: {
                role: true,
              },
            },
            department: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        }),
        prisma.user.count(),
      ]);

      return res.status(200).json({
        users,
        total,
        success: true,
        message: "Users retrieved successfully",
      });
    } else {
      const roleFilter = activeTab;

      const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
          skip: offset,
          take: parseInt(limit),
          where: {
            roles: {
              some: {
                role: roleFilter,
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            usn: true,
            employee_id: true,
            phone: true,
            roles: {
              select: {
                role: true,
              },
            },
            department: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        }),
        prisma.user.count({
          where: {
            roles: {
              some: {
                role: roleFilter,
              },
            },
          },
        }),
      ]);

      return res.status(200).json({
        users,
        total,
        success: true,
        message: "Users retrieved successfully",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query cannot be empty",
        success: false,
      });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { usn: { contains: query, mode: "insensitive" } },
          { employee_id: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        usn: true,
        employee_id: true,
        phone: true,
        roles: {
          select: {
            role: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });
    return res.status(200).json({
      users,
      success: true,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getCountOfAllUserOnTheBasisOfRole = async (req, res) => {
  try {
    const [studentsCount, facultyCount, hodCount, adminCount] =
      await prisma.$transaction([
        prisma.user.count({
          where: {
            roles: {
              some: {
                role: "student",
              },
            },
          },
        }),
        prisma.user.count({
          where: {
            roles: {
              some: {
                role: "faculty",
              },
            },
          },
        }),
        prisma.user.count({
          where: {
            roles: {
              some: {
                role: "hod",
              },
            },
          },
        }),
        prisma.user.count({
          where: {
            roles: {
              some: {
                role: "admin",
              },
            },
          },
        }),
      ]);

    const payload = {
      student: studentsCount,
      faculty: facultyCount,
      hod: hodCount,
      admin: adminCount,
    };
    return res.status(200).json({
      counts: payload,
      success: true,
      message: "User counts retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
