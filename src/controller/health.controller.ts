import { Request, Response, NextFunction } from "express";

export const healthCheckController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(200).json({
    status: "up",
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
};
