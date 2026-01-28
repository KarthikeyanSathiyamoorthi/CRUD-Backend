require("dotenv").config(); // access env file
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app URL
    credentials: true, // Allow cookies to be sent
  }),
);
app.use(express.json());
app.use(cookieParser());

// local variables
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Conneted to MongoDB"))
  .catch((err) => console.error("MongoDb connection error: ", err));

// Routes
app.use("/api/v1", todoRoutes);
app.use("", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on PORT: ${PORT} and the app name is ${APP_NAME}`,
  );
});
