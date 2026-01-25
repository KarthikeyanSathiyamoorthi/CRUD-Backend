const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Register API
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user is already exists
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invaild email or password" });

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Password is incorrect" });

    // Create JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // set BOTH tokens as HttpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh API - automatically called by frontend when access token expires
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Refrsh token is missing" });

  const user = await User.findOne({ refreshToken });
  if (!user)
    return res.status(403).json({
      message: "Invalid refresh token",
    });

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(user);

    // set new access token as a cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    res.status(201).json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(403).json({ message: "Invaild Token." });
  }
});

// Logout API
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).send({ message: "Logged out successfully" });
});

// Protected route example
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -refreshToken",
    );
    res.json({ user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
