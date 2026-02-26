import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";

// Generic validation middleware
const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail: Joi.ValidationErrorItem) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors && errors[0] && errors[0].message}`,
        errors,
      });
    }
    next();
  };
};

module.exports = validate;
