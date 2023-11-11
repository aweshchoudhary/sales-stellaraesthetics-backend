/*
  Warnings:

  - You are about to drop the column `activityId` on the `Contact` table. All the data in the column will be lost.
  - Changed the type of `size` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_activityId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "activityId";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "size",
ADD COLUMN     "size" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "_ActivityToContact" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactToFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToContact_AB_unique" ON "_ActivityToContact"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToContact_B_index" ON "_ActivityToContact"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToNote_AB_unique" ON "_ContactToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToNote_B_index" ON "_ContactToNote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToFile_AB_unique" ON "_ContactToFile"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToFile_B_index" ON "_ContactToFile"("B");

-- AddForeignKey
ALTER TABLE "_ActivityToContact" ADD CONSTRAINT "_ActivityToContact_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToContact" ADD CONSTRAINT "_ActivityToContact_B_fkey" FOREIGN KEY ("B") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToNote" ADD CONSTRAINT "_ContactToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToNote" ADD CONSTRAINT "_ContactToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToFile" ADD CONSTRAINT "_ContactToFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToFile" ADD CONSTRAINT "_ContactToFile_B_fkey" FOREIGN KEY ("B") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
