import { Document } from "mongoose";

const jwt = require("jsonwebtoken");

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
}

// Generate Access Token
function generateAccessToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" },
  );
}

// Generate Access Token
function generateRefreshToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
