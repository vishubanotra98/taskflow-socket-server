import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  fetchUserController,
  fetchWorkspaceController,
} from "../controller/user.controller.js";

const router = Router();

router.get("/user", authMiddleware, fetchUserController);
router.get("/workspaces", authMiddleware, fetchWorkspaceController);

export default router;
