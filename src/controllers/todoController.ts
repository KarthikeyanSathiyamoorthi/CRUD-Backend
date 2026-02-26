import { NextFunction, Request, Response } from "express";

const asyncHandler = require("../middleware/asyncHandler");
const Todo = require("../models/Todo"); // Todo Model
const AppError = require("../utils/AppError");

interface TodoRequest extends Request {
  body: {
    title: string;
    description: string;
  };
  user: {
    id: string;
  };
  query: {
    q: string;
  };
}

const createTodo = asyncHandler(async (req: TodoRequest, res: Response) => {
  const { title, description } = req.body;

  // Create a new Todo
  const newTodo = new Todo({
    title,
    description,
    author: req.user.id, // Get user ID from the authenticated request
  });

  // save to Database
  const savedTodo = await newTodo.save();

  res.status(201).json({
    success: true,
    message: "Todo Created successfully",
    data: savedTodo,
  });
});

const getAllTodos = asyncHandler(async (req: TodoRequest, res: Response) => {
  const { q } = req.query;
  let filter: Record<string, any> = { author: req.user.id };

  // Text search using the text index
  if (q && q.trim() !== "") {
    filter.$or = [
      { title: { $regex: `^${q}`, $options: "i" } },
      { description: { $regex: `^${q}`, $options: "i" } },
    ];
  }

  const todos = await Todo.find(filter)
    .populate("author", "name email") // Optionally populate author details
    .sort({ createdAt: -1 }); // Sort by newest first

  res.status(200).json({
    success: true,
    data: todos,
  });
});

const updateTodo = asyncHandler(
  async (req: TodoRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find the todo first
    const todo = await Todo.findById(id);

    if (!todo) {
      return next(new AppError("Todo not found", 404));
    }

    // Check if the user is the author
    if (todo.author.toString() !== req.user.id) {
      return next(new AppError("Not authorized to update this todo", 403));
    }

    // Update the todo
    todo.title = title;
    todo.description = description;
    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  },
);

const deletedTodo = asyncHandler(
  async (req: TodoRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    // if Todo not found
    if (!todo) {
      return next(new AppError("Todo not found", 404));
    }

    if (todo.author.toString() !== req.user.id) {
      return next(new AppError("Not authorized to delete this item", 403));
    }

    await todo.deleteOne();

    // success response
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: todo.toObject(), // convert to plain object
    });
  },
);

module.exports = {
  createTodo,
  getAllTodos,
  updateTodo,
  deletedTodo,
};
export {};
