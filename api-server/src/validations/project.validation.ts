import Joi from "joi";

export const createProjectSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    "string.empty": "Project name is required",
    "string.min": "Project name must be at least 2 characters long",
    "string.max": "Project name must not exceed 50 characters",
  }),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Project name must be at least 2 characters long",
    "string.max": "Project name must not exceed 50 characters",
  }),
});
