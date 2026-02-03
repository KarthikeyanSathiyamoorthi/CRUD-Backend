const Joi = require("joi");

const createAndUpdateTodoSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(5).max(50).required(),
});

module.exports = { createAndUpdateTodoSchema };
