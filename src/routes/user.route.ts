import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createWorkspaceController,
  fetchUserController,
  fetchWorkspaceController,
} from "../controller/user.controller.js";

const router = Router();

router.get("/user", authMiddleware, fetchUserController);
router.get("/workspaces", authMiddleware, fetchWorkspaceController);
router.post("/workspace", authMiddleware, createWorkspaceController);

export default router;
