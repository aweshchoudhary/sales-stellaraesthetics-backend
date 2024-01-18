import { NextFunction, Request, Response } from "express";
import { isUserExistWithId } from "../user/user.controllers";
import { PrismaClient } from "@prisma/client";
import { getLoggedUserDetials } from "../../common/common.middlewares";

const prisma = new PrismaClient();

export async function generateAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isUserExist = await isUserExistWithId(req.params.id);
    if (!isUserExist) res.status(404).json({ message: "User not found" });

    const loggedUser = await getLoggedUserDetials(req, next);

    if (loggedUser?.id === req.params.id) {
      const apiKey = crypto.randomUUID();
      const apiKeyData = await prisma.apiKey.create({
        data: {
          key: apiKey,
          userId: req.params.id,
        },
      });
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          apiKey: {
            connect: {
              id: apiKeyData.id,
            },
          },
        },
      });
      return res.status(200).json({ apiKey });
    }
  } catch (error) {
    next && next(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isUserExist = await isUserExistWithId(req.params.id);
    if (!isUserExist) res.status(404).json({ message: "User not found" });

    const loggedUser = await getLoggedUserDetials(req, next);

    if (loggedUser?.id === req.params.id) {
      await prisma.apiKey.delete({
        where: {
          userId: req.params.id,
        },
      });
      return res.status(200).json({ message: "Api key deleted successfully" });
    }
  } catch (error) {
    next && next(error);
  } finally {
    await prisma.$disconnect();
  }
}
