/*
  Warnings:

  - You are about to drop the column `activityId` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Deal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_activityId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "activityId",
DROP COLUMN "notes";

-- CreateTable
CREATE TABLE "_ActivityToDeal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DealToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToDeal_AB_unique" ON "_ActivityToDeal"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToDeal_B_index" ON "_ActivityToDeal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DealToNote_AB_unique" ON "_DealToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_DealToNote_B_index" ON "_DealToNote"("B");

-- AddForeignKey
ALTER TABLE "_ActivityToDeal" ADD CONSTRAINT "_ActivityToDeal_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToDeal" ADD CONSTRAINT "_ActivityToDeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DealToNote" ADD CONSTRAINT "_DealToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DealToNote" ADD CONSTRAINT "_DealToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
