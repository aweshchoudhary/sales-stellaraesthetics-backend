/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserCreated` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCreated_userId_key" ON "UserCreated"("userId");

-- AddForeignKey
ALTER TABLE "UserCreated" ADD CONSTRAINT "UserCreated_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
