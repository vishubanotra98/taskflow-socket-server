import { Router } from "express";
import { healthCheckController } from "../controller/health.controller.js";

const router = Router();

// Health Check
router.get("/health", healthCheckController);

export default router;
