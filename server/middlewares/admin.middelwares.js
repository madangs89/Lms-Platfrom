import jwt from "jsonwebtoken";
export const adminMiddleware = (req, res, next) => {
  try {
    const token =
      req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Not have access token.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.roles || !decoded.roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You don't have permission to access this resource.",
      });
    }
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
