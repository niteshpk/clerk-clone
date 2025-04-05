import Joi from "joi";

export const createOrgSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().messages({
    "string.empty": "Organization name is required",
    "string.min": "Organization name must be at least 2 characters long",
    "string.max": "Organization name must not exceed 50 characters",
  }),
});

export const updateOrgSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.min": "Organization name must be at least 2 characters long",
    "string.max": "Organization name must not exceed 50 characters",
  }),
});
