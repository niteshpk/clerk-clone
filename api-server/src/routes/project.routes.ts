import { Router } from "express";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validation";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

// Project routes
router.post("/", validateRequest(createProjectSchema), createProject);
router.get("/", getMyProjects);
router.get("/:id", getProjectById);
router.put("/:id", validateRequest(updateProjectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
