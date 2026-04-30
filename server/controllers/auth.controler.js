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
