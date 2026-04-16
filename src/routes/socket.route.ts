import { Router } from "express";
import { socketController } from "../controller/socket.controller.js";

const router = Router();

router.post("/broadcast", socketController);

export default router;
