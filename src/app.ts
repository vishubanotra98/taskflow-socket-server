import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import healthCheckRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

export const server = createServer(app);
export const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "DELETE", "PATCH", "PUT"] },
});

// healthCheckRoute
app.use("/api/v1", healthCheckRoute);

export default app;
