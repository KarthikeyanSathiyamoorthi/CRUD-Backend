const asyncHandler = require("../middleware/asyncHandler");
const Todo = require("../models/Todo"); // Todo Model
const AppError = require("../utils/AppError");

// const createTodo = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     // Create a new Todo
//     const newTodo = new Todo({
//       title,
//       description,
//     });

//     // save to Database
//     const savedTodo = await newTodo.save();

//     res.status(201).json({
//       success: true,
//       message: "Todo Created successfully",
//       data: savedTodo,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// const getAllTodos = async (_, res) => {
//   try {
//     const todos = await Todo.find();
//     res.status(200).json({
//       success: true,
//       data: todos,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const updateTodo = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     // Find todo by ID and update it
//     const updatedTodo = await Todo.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//       },
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Run schema validations
//       },
//     );

//     // if todo not found
//     if (!updatedTodo) {
//       return res.status(404).json({
//         success: false,
//         message: `Todo not found !!!`,
//       });
//     }

//     // Success response
//     res.status(200).json({
//       success: true,
//       message: "Todo updated Successfully",
//       data: updatedTodo,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating todo",
//       error: error.message,
//     });
//   }
// };

// const deletedTodo = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deletedTodo = await Todo.findByIdAndDelete(id);
//     // if Todo not found
//     if (!deletedTodo) {
//       return res.status(404).json({
//         success: false,
//         message: "Todo not found !!!",
//       });
//     }
//     // success response
//     res.status(200).json({
//       success: true,
//       message: "Todo deleted successfully",
//       data: deletedTodo.toObject(), // convert to plain object
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error Deleting todo",
//       error: error.message,
//     });
//   }
// };

const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

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
});

const getAllTodos = asyncHandler(async (_, res) => {
  const todos = await Todo.find();
  res.status(200).json({
    success: true,
    data: todos,
  });
});

const updateTodo = asyncHandler(async (req, res, next) => {
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
    return next(new AppError("Todo not found", 404));
  }

  // Success response
  res.status(200).json({
    success: true,
    message: "Todo updated Successfully",
    data: updatedTodo,
  });
});

const deletedTodo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedTodo = await Todo.findById(id);
  // if Todo not found
  if (!deletedTodo) {
    return next(new AppError("Todo not found", 404));
  }

  if (deletedTodo._id.toString() !== id) {
    return next(new AppError("Not authorized to delete this item", 403));
  }

  await deletedTodo.deleteOne();

  // success response
  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: deletedTodo.toObject(), // convert to plain object
  });
});

module.exports = { createTodo, getAllTodos, updateTodo, deletedTodo };
