import { NextFunction, Request, Response } from "express";

require("dotenv").config(); // access env file
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
const avatarRoutes = require("./routes/avatar");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Your React app URL
    credentials: true, // Allow cookies to be sent
  }),
);
app.use(express.json()); // Parses incoming JSON requests
app.use(cookieParser());

// IMPORTANT: Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// local variables
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
const ENVIRONMENT = process.env.NODE_ENV;

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Conneted to MongoDB"))
  .catch((err: unknown) => console.error("MongoDb connection error: ", err));

// Routes
app.use("/api/v1", todoRoutes);
app.use("/api/v1", avatarRoutes);
app.use("", authRoutes);

// Handle 404 errors
app.use((req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware (MUST be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on PORT: ${PORT} and the app name is ${APP_NAME} and the environment is ${ENVIRONMENT}`,
  );
});
