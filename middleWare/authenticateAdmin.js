import jwt from "jsonwebtoken";
import Admin from "../model/AdminModel.js";
import logger from "../utils/Logger.js";
const authenticateAdmin = async (req, res, next) => {
  logger.warn("Authentication hit ");
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Bearer access token is required",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET environment variable is required",
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Access token expired. Please log in again"
        : "Invalid access token";
    return res.status(401).json({
      success: false,
      message,
    });
  }

  if (typeof payload !== "object" || !payload.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }

  try {
    const admin = await Admin.findById(payload.userId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found",
      });
    }

    req.Admin = admin;
    return next();
  } catch (error) {
    logger.error("Admin authentication lookup failed", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify admin account",
    });
  }
};

export default authenticateAdmin;
