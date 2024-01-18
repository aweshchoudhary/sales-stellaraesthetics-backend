import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export async function verifyActivityPerformingAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const activity = await prisma.activity.count({
      where: { id: req.params.id, performer: req.body.performerId },
    });
    if (activity !== 1) {
      res.status(401).json({ message: "You don't access to this activity" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
}
export async function verifyActivityAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const activity = await prisma.activity.count({
      where: { id: req.params.id, createdBy: req.body.createdById },
    });
    if (activity !== 1) {
      res.status(401).json({ message: "You don't access to this activity" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
}
