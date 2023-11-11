/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Pipeline` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Assignees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PipelineToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `performer` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Pipeline` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pipeline" DROP CONSTRAINT "Pipeline_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_Assignees" DROP CONSTRAINT "_Assignees_A_fkey";

-- DropForeignKey
ALTER TABLE "_Assignees" DROP CONSTRAINT "_Assignees_B_fkey";

-- DropForeignKey
ALTER TABLE "_PipelineToUser" DROP CONSTRAINT "_PipelineToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PipelineToUser" DROP CONSTRAINT "_PipelineToUser_B_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "performer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "creator" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pipeline" DROP COLUMN "ownerId",
ADD COLUMN     "assignees" TEXT[],
ADD COLUMN     "owner" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_Assignees";

-- DropTable
DROP TABLE "_PipelineToUser";
