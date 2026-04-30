import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";
export const createUser = async (req, res) => {
  try {
    const { name, email, password, department_id, roles } = req.body;
    const currentUserId = req.user.id;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    if (!department_id) {
      return res
        .status(400)
        .json({ message: "Department is required", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // here need to handle
    //   for student usn number
    // for faculty employee_id

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          department_id,
        },
      });

      if (roles && roles?.length > 0) {
        await tx.userRoles.createMany({
          data: roles.map((role) => {
            return {
              user_id: newUser.id,
              role,
              granted_by: currentUserId,
            };
          }),
        });
      }

      return newUser;
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
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
