import { Router } from "express";
import {
  createOrg,
  getMyOrgs,
  getOrgById,
  updateOrg,
  deleteOrg,
} from "../controllers/org.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

// POST /api/orgs - Create a new organization
router.post("/", createOrg);

// GET /api/orgs - Get all organizations for the current user
router.get("/", getMyOrgs);

// GET /api/orgs/:id - Get organization by ID
router.get("/:id", getOrgById);

// PUT /api/orgs/:id - Update organization
router.put("/:id", updateOrg);

// DELETE /api/orgs/:id - Delete organization
router.delete("/:id", deleteOrg);

export default router;
