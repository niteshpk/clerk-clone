import express from "express";
import {
  createOrganizationRole,
  getOrganizationRole,
  updateOrganizationRole,
  deleteOrganizationRole,
  getOrganizationRoles,
} from "../controllers/organizationRole";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createOrganizationRoleSchema,
  updateOrganizationRoleSchema,
} from "../validations/organizationRole";

const router = express.Router();

// Create a new organization role
router.post(
  "/",
  validateRequest(createOrganizationRoleSchema),
  createOrganizationRole
);

// Get all organization roles (with optional organization_id filter)
router.get("/", getOrganizationRoles);

// Get a specific organization role
router.get("/:id", getOrganizationRole);

// Update an organization role
router.put(
  "/:id",
  validateRequest(updateOrganizationRoleSchema),
  updateOrganizationRole
);

// Delete an organization role
router.delete("/:id", deleteOrganizationRole);

export default router;
