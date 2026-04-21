import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  fetchUserController,
  inviteUserController,
} from "../controller/user.controller.js";

const router = Router();

router.get("/user", authMiddleware, fetchUserController);
router.post("/member-invite", authMiddleware, inviteUserController);

export default router;
