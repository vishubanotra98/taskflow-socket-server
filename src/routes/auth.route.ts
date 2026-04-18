import { Router } from "express";
import {
  emailVerificationController,
  signInController,
  signUpController,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/verification", emailVerificationController);

export default router;
