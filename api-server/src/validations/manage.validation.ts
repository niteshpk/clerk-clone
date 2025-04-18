import Joi from "joi";

const permissionSchema = Joi.object({
  permissionId: Joi.string().required().messages({
    "any.required": "Permission ID is required",
    "string.empty": "Permission ID cannot be empty",
  }),
  isChecked: Joi.boolean().required().messages({
    "any.required": "isChecked status is required",
  }),
});

const rolePermissionSchema = Joi.object({
  roleId: Joi.string().required().messages({
    "any.required": "Role ID is required",
    "string.empty": "Role ID cannot be empty",
  }),
  permissions: Joi.array().items(permissionSchema).required().messages({
    "any.required": "Permissions array is required",
    "array.base": "Permissions must be an array",
  }),
});

export const updateRoleWisePermissionsSchema = Joi.array()
  .items(rolePermissionSchema)
  .required()
  .messages({
    "any.required": "Role permissions array is required",
    "array.base": "Request body must be an array of role permissions",
  });
