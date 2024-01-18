/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `uploaderId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Pipeline` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Stage` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `ActivityFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Pipeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `UserCreated` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Pipeline" DROP CONSTRAINT "Pipeline_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_creatorId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "ActivityFile" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "uploaderId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pipeline" DROP COLUMN "ownerId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "UserCreated" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityFile" ADD CONSTRAINT "ActivityFile_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserCreated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
