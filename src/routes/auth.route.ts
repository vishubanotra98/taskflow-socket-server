import { Router } from "express";
import {
  emailVerificationController,
  refresh,
  signInController,
  signUpController,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/refresh", refresh);
router.post("/verification", emailVerificationController);

export default router;
