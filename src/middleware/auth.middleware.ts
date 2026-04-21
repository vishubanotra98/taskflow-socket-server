import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ACCESS_TOKEN_SECRET } from "../constants/constant.js";

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req?.cookies?.access_token;

  if (!accessToken) {
    res.status(401).json({
      success: false,
      status: 401,
      code: "UNAUTHORIZED",
      message: "Authentication token is missing",
    });
    return;
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: any, data: any) => {
    if (err) {
      res.status(401).json({
        success: false,
        status: 401,
        code:
          err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
      return;
    }
    if (!data?.user_id) {
      res.status(401).json({
        success: false,
        status: 401,
        code: "INVALID_TOKEN",
        message: "Invalid token payload",
      });
      return;
    }
    req.userId = data.user_id;
    next();
  });
};
