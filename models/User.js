const mongoose = require("mongoose");

// Define the structure of the User Date
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
});

// Create and export the Model
const User = mongoose.model("User", userSchema);
module.exports = User;
