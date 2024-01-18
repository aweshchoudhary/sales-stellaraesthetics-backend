/*
  Warnings:

  - Made the column `uploaderId` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uploaderId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "uploaderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
