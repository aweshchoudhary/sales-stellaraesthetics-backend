import { z } from "zod";
import { notificationCreateSchema } from "./notifcation.util";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createNotification(
  data: z.infer<typeof notificationCreateSchema>
) {
  const notification = await prisma.notification.create({
    data: {
      name: data.body.name,
      content: data.body.content,
    },
  });
  return notification;
}

export async function sendNotificationToUsers(
  notificationId: string,
  userIds: string[]
) {
  userIds.map(async (userId: string) => {
    await prisma.notificationsOnUsers.createMany({
      data: {
        notificationId: notificationId,
        userId,
      },
    });
  });
}
