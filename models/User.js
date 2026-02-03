const mongoose = require("mongoose");

// Define the structure of the User Date
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

// Create and export the Model
const User = mongoose.model("User", userSchema);
module.exports = User;
