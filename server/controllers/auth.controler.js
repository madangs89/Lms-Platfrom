import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";

const createToken = (user) => {
  const roles = user.roles.map((r) => r.role);
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      usn: user?.usn || null,
      employee_id: user?.employee_id || null,
      phone: user?.phone || null,
      department_id: user?.department_id || null,
      profile_photo_url: user?.profile_photo_url || null,
      status: user?.status || null,
      roles,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};

const createCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use https in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // works for localhost
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // 2. Check status (important)
    if (user.status !== "active") {
      return res.status(403).json({
        message: `Account is ${user.status}`,
        success: false,
      });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = createToken(user);

    createCookie(res, token);

    // 5. Optional: update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        last_login_at: new Date(),
      },
    });

    // 6. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        usn: user?.usn || null,
        employee_id: user?.employee_id || null,
        phone: user?.phone || null,
        department_id: user?.department_id || null,
        profile_photo_url: user?.profile_photo_url || null,
        status: user?.status || null,
        roles: user.roles.map((r) => r.role),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }
    const { id } = req?.user;

    if (!id) {
      return res.status(400).json({
        message: "Not Authenticated",
        success: false,
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user: currentUser,
      message: "User found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req?.user?.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
        success: false,
      });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password_hash: hashedNewPassword,
      },
    });
    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
