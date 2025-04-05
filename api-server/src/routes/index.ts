import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import orgRoutes from "./org.routes";
import sessionRoutes from "./session.routes";
import orgRoleRoutes from "./org-role.routes";
import permissionRoutes from "./org-permission.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/orgs", orgRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/org-roles", orgRoleRoutes);
router.use("/api/org-permissions", permissionRoutes);

export default router;
