import Admin from "../model/AdminModel.js";
import argon2 from "argon2";
import { validateLogin, validateRegistration } from "../utils/Validation.js";
import generateToken from "../utils/genreateToken.js";
import logger from "../utils/Logger.js";
const createAdmin = async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.error("validation Error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { name, email, password, department } = req.body;

    const usesExited = await Admin.findOne({ email });
    if (usesExited) {
      logger.warn("User already exist");
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    const hashedPassword = await argon2.hash(password);
    const admin = new Admin({
      name,
      department,
      password: hashedPassword,
      email,
    });
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    logger.info("Login endpoint hit..");

    const { error } = validateLogin(req.body);
    if (error) {
      logger.error("validation Error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await Admin.findOne({ email });

    if (!user) {
      logger.warn("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      logger.warn("Invalid password");
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { refreshToken, accessToken } = await generateToken(user);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    });
    
  } catch (error) {
    logger.error("Login error occured", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export { createAdmin, loginUser };
