const mongoose = require("mongoose");

// Define the structure of the Todo data
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  { timestamps: true }
);

// Create and export the  Model
const TodoData = mongoose.model("Todo", todoSchema);
module.exports = TodoData;
