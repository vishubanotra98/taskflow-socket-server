import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import { DEFAULT_STATUSES } from "../constants/constant.js";

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

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, workspaceName } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId",
      });
    }

    if (!workspaceName) {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "INVALID_WORKSPACE_NAME",
        message: "Invalid or missing workspace name",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        code: "USER_NOT_FOUND",
        message: "User not found.",
      });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        members: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
        statuses: {
          create: DEFAULT_STATUSES.map((status) => ({
            name: status.name,
            color: status.color,
            order: status.order,
            isDefault: status.isDefault,
          })),
        },
      },
      include: { statuses: true },
    });

    return res.status(201).json({
      success: true,
      status: 201,
      code: "WORKSPACE_CREATED",
      message: "Workspace created successfully.",
      data: {
        workspace,
      },
    });
  },
);
