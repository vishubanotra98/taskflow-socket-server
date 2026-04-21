import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import { DEFAULT_STATUSES } from "../constants/constant.js";

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

    const adminList = user?.workspaces
      ?.filter((ws) => ws?.role === "ADMIN")
      ?.map((ws) => ws?.workspaceId);

    return res.status(200).json({
      success: true,
      status: 200,
      code: "WORKSPACES_FETCHED",
      message: "Fetched all workspaces.",
      data: {
        workspaces: user?.workspaces,
        adminList,
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

export const fetchTeamProjectController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = req.params.workspaceId as string;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "INVALID_WORKSPACE_ID",
        message: "Invalid or missing workspaceId",
      });
    }

    const teamProject = await prisma.team.findMany({
      where: { workspaceId },
      include: { projects: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      code: "FETCHED_TEAMS",
      message: "Fetched teams and projects successfully.",
      data: {
        teamData: teamProject,
      },
    });
  },
);

export const createTeamController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId, teamName } = req.body;
    const userId = req.userId as string;

    const membership = await prisma.workspaceMembers?.findFirst({
      where: { userId, workspaceId },
    });

    if (!membership) {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "INVALID_MEMBER",
        message: "You are not member of this workspace",
      });
    }

    if (membership.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        status: 403,
        code: "FORBIDDEN",
        message: "Only admins can create teams",
      });
    }

    const adminMembers = await prisma.workspaceMembers?.findMany({
      where: { workspaceId, role: "ADMIN" },
      select: { userId: true },
    });

    const adminIds = adminMembers?.map((admin) => admin?.userId);
    const teamMemberIds = Array.from(new Set([userId, ...adminIds]));

    await prisma.team.create({
      data: {
        name: teamName,
        workspaceId,
        members: {
          create: teamMemberIds?.map((id) => ({
            userId: id,
          })),
        },
      },
    });

    return res.status(201).json({
      success: true,
      status: 201,
      code: "TEAM_CREATED",
      message: "Team created successfully.",
    });
  },
);

export const createProjectController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    console.log(req.body);
    const { teamId, projectName } = req.body;

    if (!teamId || !projectName) {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "MISSING_FIELDS",
        message: "teamId and projectName are required",
      });
    }

    const membership = await prisma.teamMembers.findFirst({
      where: { teamId, userId },
      include: { team: true },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        status: 403,
        code: "NOT_A_MEMBER",
        message: "You must be a member of this team to create a project.",
      });
    }

    const workspaceId = membership?.team?.workspaceId;
    const workspaceUser = await prisma.workspaceMembers.findFirst({
      where: { workspaceId, userId },
    });

    if (workspaceUser?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        status: 403,
        code: "FORBIDDEN",
        message: "You must be an admin to create a project.",
      });
    }

    const project = await prisma.project.create({
      data: {
        name: projectName,
        teamId,
      },
    });

    return res.status(201).json({
      success: true,
      status: 201,
      code: "PROJECT_CREATED",
      message: "Project created successfully.",
      data: { project },
    });
  },
);

export const lastActiveWorkspaceController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const workspaceId = req.params?.workspaceId as string;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        status: 400,
        code: "MISSING_FIELDS",
        message: "workspaceId is required",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        lastActiveWorkspaceId: workspaceId,
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      code: "LAST_ACTIVE_WORKSPACE_UPDATED",
      message: "Last active workspace updated successfully.",
    });
  },
);
