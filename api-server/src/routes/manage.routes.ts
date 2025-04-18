import { Router } from "express";
import {
  getRoleWisePermissionsForProject,
  updateRoleWisePermissionsForProject,
} from "../controllers/manage.controller";
import { updateRoleWisePermissionsSchema } from "../validations/manage.validation";
import { validateRequest } from "../middlewares/validateRequest";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

// Get role-wise permissions for a project
router.get("/projects/:projectId", getRoleWisePermissionsForProject);

// Update role-wise permissions for a project
router.put(
  "/projects/:projectId",
  validateRequest(updateRoleWisePermissionsSchema),
  updateRoleWisePermissionsForProject
);

export default router;
