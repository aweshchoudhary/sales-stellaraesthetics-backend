-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "desc" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
