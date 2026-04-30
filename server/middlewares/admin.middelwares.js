import jwt from "jsonwebtoken";
export const adminMiddleware = (req, res, next) => {
  try {
    const user = req.user;

    if (!user.roles || !user.roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You don't have permission to access this resource.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
