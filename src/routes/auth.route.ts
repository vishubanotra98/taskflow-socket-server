import { Router } from "express";
import { signUpController } from "../controller/auth.controller.js";

const router = Router();

router.post("/signup", signUpController);

export default router;
