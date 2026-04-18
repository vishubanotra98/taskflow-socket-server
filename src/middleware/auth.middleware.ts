import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req?.cookies?.accessToken;

  if (accessToken) {
    jwt.verify(accessToken, SECRET, (err: any, data: any) => {
      if (err) {
        return res?.status(401)?.json({
          error: err,
        });
      }
      next();
    });
  }
};
