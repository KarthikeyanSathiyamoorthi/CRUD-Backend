const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const validate = require("../middleware/validation");
const { createAndUpdateTodoSchema } = require("../validators/todoValidators");
const {
  createTodo,
  getAllTodos,
  updateTodo,
  deletedTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.use(authenticateToken); // Protect all routes

// POST API - Add new Tado
router.post("/create", validate(createAndUpdateTodoSchema), createTodo);

// GET API - Get all Todos
router.get("/todos", getAllTodos);

// PUT API - Update a Todo
router.put("/update/:id", validate(createAndUpdateTodoSchema), updateTodo);

// DELETE API - Delete a Todo
router.delete("/delete/:id", deletedTodo);

module.exports = router;
export {};
