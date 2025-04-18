import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import sessionRoutes from "./session.routes";
import projectRoleRoutes from "./project-role.routes";
import permissionRoutes from "./project-permission.routes";
import managePermissionRoutes from "./manage.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/projects", projectRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/project-roles", projectRoleRoutes);
router.use("/api/project-permissions", permissionRoutes);
router.use("/api/manage-permissions", managePermissionRoutes);

export default router;
