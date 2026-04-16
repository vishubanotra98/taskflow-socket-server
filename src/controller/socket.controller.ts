import { Request, Response, NextFunction } from "express";
import { io } from "../app.js";

export const socketController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { event, data } = req.body;
  io.emit(event, data);
  res.status(200).json({
    success: true,
  });
};
