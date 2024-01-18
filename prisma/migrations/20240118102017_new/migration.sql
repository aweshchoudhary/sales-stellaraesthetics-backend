/*
  Warnings:

  - You are about to drop the column `assignedBy` on the `AssigneesOnPipelines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssigneesOnPipelines" DROP COLUMN "assignedBy";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationsOnUsers" (
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationsOnUsers_pkey" PRIMARY KEY ("notificationId","userId")
);

-- AddForeignKey
ALTER TABLE "NotificationsOnUsers" ADD CONSTRAINT "NotificationsOnUsers_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationsOnUsers" ADD CONSTRAINT "NotificationsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
