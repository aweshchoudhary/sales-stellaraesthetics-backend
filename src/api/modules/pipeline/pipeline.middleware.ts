import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export async function checkPipelineOwnerAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loggedUser: any = req.user;
  const pipeline = await prisma.pipeline.count({
    where: {
      id: req.params.pipelineId ?? req.body.pipelineId,
      createdBy: {
        id: loggedUser.created.id,
      },
    },
  });

  if (pipeline === 0) {
    return res
      .status(400)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}
export async function checkPipelineAssigneeAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loggedUser: any = req.user;

  const pipeline = await prisma.assigneesOnPipelines.count({
    where: {
      pipelineId: req.params.pipelineId ?? req.body.pipelineId,
      assigneeId: loggedUser.created.id,
    },
  });

  if (pipeline === 0) {
    return res
      .status(400)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}

export async function checkPipelineAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loggedUser: any = req.user;

  const isPipelineWithOwnerId = await prisma.pipeline.count({
    where: {
      id: req.params.pipelineId ?? req.body.pipelineId,
      createdById: loggedUser.created.id,
    },
  });

  const isPipelineWithAssigneeId = await prisma.assigneesOnPipelines.count({
    where: {
      pipelineId: req.params.pipelineId ?? req.body.pipelineId,
      assigneeId: loggedUser.created.id,
    },
  });

  if (isPipelineWithAssigneeId === 0 && isPipelineWithOwnerId === 0) {
    return res
      .status(400)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}
