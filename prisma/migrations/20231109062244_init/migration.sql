/*
  Warnings:

  - You are about to drop the column `activities` on the `Deal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "activities";

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "pipelineId" TEXT;

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Assignees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PipelineToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Assignees_AB_unique" ON "_Assignees"("A", "B");

-- CreateIndex
CREATE INDEX "_Assignees_B_index" ON "_Assignees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PipelineToUser_AB_unique" ON "_PipelineToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PipelineToUser_B_index" ON "_PipelineToUser"("B");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Assignees" ADD CONSTRAINT "_Assignees_A_fkey" FOREIGN KEY ("A") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Assignees" ADD CONSTRAINT "_Assignees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PipelineToUser" ADD CONSTRAINT "_PipelineToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PipelineToUser" ADD CONSTRAINT "_PipelineToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
