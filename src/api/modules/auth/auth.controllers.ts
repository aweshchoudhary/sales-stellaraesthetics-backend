import { PrismaClient } from "@prisma/client";
import { isUserExistWithId } from "../user/user.controllers";
import { NextFunction } from "express";

const prisma = new PrismaClient();

export async function getUserByApiKey(apiKey: string, next: NextFunction) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        apiKey: {
          key: apiKey,
        },
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    next && next(error);
  } finally {
    await prisma.$disconnect();
  }
}
