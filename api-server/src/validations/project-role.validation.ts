import Joi from "joi";

export const createProjectRoleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  project: Joi.string().required(),
  permissions: Joi.array().items(Joi.string()).required(),
});

export const updateProjectRoleSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  permissions: Joi.array().items(Joi.string()),
});
