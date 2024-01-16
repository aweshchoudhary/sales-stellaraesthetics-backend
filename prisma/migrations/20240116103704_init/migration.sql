-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_labelId_fkey";

-- AlterTable
ALTER TABLE "Deal" ALTER COLUMN "labelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;
