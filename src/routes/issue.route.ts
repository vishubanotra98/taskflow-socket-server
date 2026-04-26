import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createIssueController,
  deleteIssueController,
  editIssueController,
  moveCardController,
} from "../controller/issue.controller.js";

const router = Router();

router.post("/issue", authMiddleware, createIssueController);
router.patch("/issue", authMiddleware, editIssueController);
router.delete("/issue", authMiddleware, deleteIssueController);
router.put("/issue-move", authMiddleware, moveCardController);

export default router;
