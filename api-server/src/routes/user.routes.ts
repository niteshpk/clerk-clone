import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

router.post("/", createUser);
router.get("/", getAllUsers);

export default router;
