import { PrismaClient } from "@prisma/client";
import { NextFunction, Request } from "express";
import { UserBaseInterface } from "../modules/user/user.util";
import { BaseModel } from "./interfaces";

const prisma = new PrismaClient();

export async function getLoggedUserDetials(
  req: Request,
  next: NextFunction
): Promise<(UserBaseInterface & BaseModel) | undefined | null> {
  try {
    const loggedUser: any = req?.user;
    const user = await prisma.user.findFirst({
      where: {
        userId: loggedUser.uid ?? "",
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect();
  }
}
