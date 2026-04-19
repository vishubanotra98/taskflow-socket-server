import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.js";

export const fetchUserController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "User ID is missing from the request.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        image: true,
        lastActiveWorkspaceId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        code: "USER_NOT_FOUND",
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      code: "USER_DETAILS_FETCHED",
      message: "User details fetched successfully.",
      data: {
        user,
      },
    });
  },
);

export const fetchWorkspaceController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.userId;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        workspaces: { include: { workspace: true } },
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      code: "WORKSPACES_FETCHED",
      message: "Fetched all workspaces.",
      data: {
        workspaces: user?.workspaces,
      },
    });
  },
);
