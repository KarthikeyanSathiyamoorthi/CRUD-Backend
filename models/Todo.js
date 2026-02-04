const mongoose = require("mongoose");

// Define the structure of the Todo data
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      match: [
        /^[a-zA-Z0-9_ .,!?'-]+$/,
        "Title can only contain letters, numbers, spaces, and basic punctuation",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters"],
      match: [
        /^[a-zA-Z0-9_ .,!?'-]+$/,
        "Description can only contain letters, numbers, spaces, and basic punctuation",
      ],
    },
  },
  { timestamps: true },
);

// Create and export the  Model
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
