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
      owner: {
        firebaseUID: loggedUser.uid,
      },
    },
  });

  if (pipeline === 0) {
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
  const loggedUser: any = req.user;
  const pipeline = await prisma.pipeline.count({
    where: {
      id: req.params.pipelineId ?? req.body.pipelineId,
      assignees: { has: loggedUser.uid },
    },
  });

  if (pipeline === 0) {
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
  const loggedUser: any = req.user;
  const pipeline = await prisma.pipeline.count({
    where: {
      id: req.params.pipelineId ?? req.body.pipelineId,
      OR: [
        {
          owner: {
            firebaseUID: loggedUser.uid,
          },
        },
        { assignees: { has: loggedUser.uid } },
      ],
    },
  });

  if (pipeline === 0) {
    return res
      .status(401)
      .json({ message: "You don't have access to this pipeline" });
  }

  next();
}
