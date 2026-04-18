import express, { urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgon from "morgan";
import { errorHandler } from "./middleware/error.middleware.js";
import healthCheckRoute from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV != "production") {
  app.use(morgon("dev"));
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  },
});

// healthCheckRoute
app.use("/api/v1", healthCheckRoute);

// Auth Routes
app.use("/auth", authRoutes);

export default app;

app.use(errorHandler);
