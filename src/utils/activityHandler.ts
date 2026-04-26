import { prisma } from "../lib/prisma.js";

export const activityLogger = async (data: any) => {
  try {
    const res = await prisma.activity.create({
      data: {
        action: data?.action,
        entityTitle: data?.entityTitle,
        userId: data?.userId,
        workspaceId: data?.workspaceId,
        teamId: data?.teamId,
        projectId: data?.projectId,
        issueId: data?.issueId,
        beforeState: data?.beforeState || null,
        afterState: data?.afterState || null,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};
