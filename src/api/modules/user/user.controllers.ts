import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

export async function isUserExistWithId(userId: string) {
  const user = await prisma.user.count({
    where: {
      id: userId,
    },
  });
  if (user === 0) {
    return false;
  }
  return true;
}
