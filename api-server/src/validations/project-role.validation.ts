import Joi from "joi";

export const createProjectRoleSchema = Joi.object({
  role: Joi.string().required(),
  project_id: Joi.string().required(),
});

export const updateProjectRoleSchema = Joi.object({
  role: Joi.string(),
  project_id: Joi.string().required(),
});
