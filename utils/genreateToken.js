import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../model/ReshToken.js";

const generateToken = async (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      userName: user.name,
    },
    jwtSecret,
    { expiresIn: "30m" },
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expireAt = new Date();
  expireAt.setDate(expireAt.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expireAt,
  });

  return { accessToken, refreshToken };
};

export default generateToken;
