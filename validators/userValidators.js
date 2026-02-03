const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(25).required().messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot be exceed 25 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
