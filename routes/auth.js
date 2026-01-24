const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh API
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Token is missing." });

  const user = await User.findOne({ refreshToken });
  if (!user)
    return res.status(403).json({
      message: "Invalid token or token is deleted from the database.",
    });

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(user);
    res
      .status(201)
      .json({ message: "Token is created.", accessToken: accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invaild Token." });
  }
});

// Logout API
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Token is missing." });

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.clearCookie("refreshToken");
  res.status(204).send();
});

module.exports = router;
