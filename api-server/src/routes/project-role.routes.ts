import { Router } from "express";
import {
  createProjectRole,
  getProjectRole,
  updateProjectRole,
  deleteProjectRole,
  getProjectRoles,
} from "../controllers/project-role.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createProjectRoleSchema,
  updateProjectRoleSchema,
} from "../validations/project-role.validation";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

// Project role routes
router.post("/", validateRequest(createProjectRoleSchema), createProjectRole);

router.get("/", getProjectRoles);

router.get("/:id", getProjectRole);

router.put("/:id", validateRequest(updateProjectRoleSchema), updateProjectRole);

router.delete("/:id", deleteProjectRole);

export default router;
