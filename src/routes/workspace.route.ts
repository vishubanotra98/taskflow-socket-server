import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createProjectController,
  createTeamController,
  createWorkspaceController,
  fetchTeamProjectController,
  fetchWorkspaceController,
  lastActiveWorkspaceController,
} from "../controller/workspace.controller.js";

const router = Router();

router.get("/workspaces", authMiddleware, fetchWorkspaceController);
router.post("/workspace", authMiddleware, createWorkspaceController);
router.get("/team/:workspaceId", authMiddleware, fetchTeamProjectController);
router.post("/team", authMiddleware, createTeamController);
router.post(
  "/last-active-workspace/:workspaceId",
  authMiddleware,
  lastActiveWorkspaceController,
);
router.post("/project", authMiddleware, createProjectController);

export default router;
