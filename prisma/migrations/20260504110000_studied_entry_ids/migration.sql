-- AlterTable
ALTER TABLE "TraineePlanProgress" ADD COLUMN "studiedEntryIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
