-- CreateTable
CREATE TABLE "NotificationsOpenByOnUsers" (
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationsOpenByOnUsers_pkey" PRIMARY KEY ("notificationId","userId")
);

-- AddForeignKey
ALTER TABLE "NotificationsOpenByOnUsers" ADD CONSTRAINT "NotificationsOpenByOnUsers_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationsOpenByOnUsers" ADD CONSTRAINT "NotificationsOpenByOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
