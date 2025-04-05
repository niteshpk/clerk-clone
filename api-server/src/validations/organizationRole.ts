import Joi from "joi";

export const createOrganizationRoleSchema = Joi.object({
  organization_id: Joi.string().required(),
  role: Joi.string().required(),
});

export const updateOrganizationRoleSchema = Joi.object({
  role: Joi.string(),
});
