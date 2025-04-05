import { Router } from "express";
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionById,
} from "../controllers/org-permission.controller";

const router = Router();

// Get all permissions for an organization
router.get("/", getAllPermissions);

// Get a single permission by ID
router.get("/:id", getPermissionById);

// Create a new permission
router.post("/", createPermission);

// Update a permission
router.put("/:id", updatePermission);

// Delete a permission
router.delete("/:id", deletePermission);

export default router;
