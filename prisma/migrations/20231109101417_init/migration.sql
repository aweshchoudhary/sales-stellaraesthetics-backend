/*
  Warnings:

  - Made the column `pipelineId` on table `Stage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_pipelineId_fkey";

-- AlterTable
ALTER TABLE "Pipeline" ALTER COLUMN "desc" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Stage" ALTER COLUMN "pipelineId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
