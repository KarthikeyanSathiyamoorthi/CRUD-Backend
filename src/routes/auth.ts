const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const validate = require("../middleware/validation");
const { registerSchema, loginSchema } = require("../validators/userValidators");
const {
  registerUser,
  userLogin,
  refresh,
  logout,
  protectedRoute,
} = require("../controllers/authController");

const router = express.Router();

// Register API
router.post("/register", validate(registerSchema), registerUser);

// Login API
router.post("/login", validate(loginSchema), userLogin);

// Refresh API - automatically called by frontend when access token expires
router.post("/refresh", refresh);

// Logout API
router.post("/logout", logout);

// Protected route example
router.get("/me", authenticateToken, protectedRoute);

module.exports = router;
export {};
