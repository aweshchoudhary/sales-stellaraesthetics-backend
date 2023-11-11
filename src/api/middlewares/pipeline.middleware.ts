import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export async function checkPipelineOwnerAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pipeline = await prisma.pipeline.findUnique({
    where: {
      id: req.params.id ?? req.body.pipelineId,
      // owner: req.oidc.user?.sub,
    },
  });

  if (!pipeline) {
    return res
      .status(401)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}
export async function checkPipelineAssigneeAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pipeline = await prisma.pipeline.count({
    where: {
      id: req.params.id ?? req.body.pipelineId,
      // assignees: { has: req.oidc.user?.sub },
    },
  });

  if (pipeline !== 1) {
    return res
      .status(401)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}

export async function checkPipelineAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pipeline = await prisma.pipeline.count({
    where: {
      id: req.params.id ?? req.body.pipelineId,
      // OR: [
      //   { owner: req.oidc.user?.sub },
      //   { assignees: { has: req.oidc.user?.sub } },
      // ],
    },
  });

  if (pipeline !== 1) {
    return res
      .status(401)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}
