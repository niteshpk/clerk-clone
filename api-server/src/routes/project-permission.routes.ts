import { Router } from "express";
import {
  getProjectPermissions,
  getProjectPermission,
  createProjectPermission,
  updateProjectPermission,
  deleteProjectPermission,
} from "../controllers/project-permission.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

// Create project permission
router.post("/", createProjectPermission);

// Update project permission
router.put("/:id", updateProjectPermission);

// Delete project permission
router.delete("/:id", deleteProjectPermission);

router.get("/", getProjectPermissions);

router.get("/:id", getProjectPermission);

export default router;
