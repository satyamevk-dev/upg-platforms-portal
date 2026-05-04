-- Per-topic quiz completion: stable keys survive plan reorder / new modules.
ALTER TABLE "TraineePlanProgress" ADD COLUMN "completedEntryIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
