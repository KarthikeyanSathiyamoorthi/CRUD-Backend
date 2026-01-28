const express = require("express");
// Todo Model
const Todo = require("../models/Todo");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// POST API - Add new Tado
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required !!!",
      });
    }

    // Create a new Todo
    const newTodo = new Todo({
      title,
      description,
    });

    // save to Database
    const savedTodo = await newTodo.save();

    res.status(201).json({
      success: true,
      message: "Todo Created successfully",
      data: savedTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// GET API - Get all Todos
router.get("/todos", authenticateToken, async (_, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT API - Update a Todo
router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find todo by ID and update it
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validations
      },
    );
    // if todo not found
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: `Todo not found !!!`,
      });
    }
    // Success response
    res.status(200).json({
      success: true,
      message: "Todo updated Successfully",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating todo",
      error: error.message,
    });
  }
});

// DELETE API - Delete a Todo
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    // if Todo not found
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found !!!",
      });
    }
    // success response
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: deletedTodo.toObject(), // convert to plain object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Deleting todo",
      error: error.message,
    });
  }
});

module.exports = router;
