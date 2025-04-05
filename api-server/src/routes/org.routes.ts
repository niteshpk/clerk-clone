import { Router } from "express";
import { createOrg, getMyOrgs } from "../controllers/org.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.post("/", authMiddleware, createOrg);
router.get("/", authMiddleware, getMyOrgs);
export default router;
