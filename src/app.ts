import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgon from "morgan";
import { errorHandler } from "./middleware/error.middleware.js";
import healthCheckRoute from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import cookieParser from "cookie-parser";
import { BASE_URL_CLIENT } from "./constants/constant.js";

dotenv.config();

console.log(BASE_URL_CLIENT);

const app = express();

if (process.env.NODE_ENV != "production") {
  app.use(morgon("dev"));
}

app.use(cookieParser());
app.use(
  cors({
    origin: BASE_URL_CLIENT,
    credentials: true,
  }),
);
app.use(express.json());

export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: BASE_URL_CLIENT,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  },
});

// healthCheckRoute
app.use("/api/v1", healthCheckRoute);

// Auth Routes
app.use("/auth", authRoutes);

// user routes
app.use("/api/v1", userRoutes);

// Workspace Routes
app.use("/api/v1", workspaceRoutes);

export default app;

app.use(errorHandler);
