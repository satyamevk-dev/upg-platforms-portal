-- AlterTable
ALTER TABLE "TrainingPlan" ADD COLUMN "clientMasterId" TEXT;

-- Backfill: old plan.clientId pointed at portal `User` (Avaya/Nokia accounts); map to `ClientMaster` by name or email
UPDATE "TrainingPlan" AS tp
SET "clientMasterId" = cm."id"
FROM "User" AS u, "ClientMaster" AS cm
WHERE tp."clientId" = u."id"
  AND cm."name" IN ('Avaya', 'Nokia')
  AND (
    (u."name" IS NOT NULL AND u."name" = cm."name")
    OR (LOWER(u."email") = 'avaya@training.local' AND cm."name" = 'Avaya')
    OR (LOWER(u."email") = 'nokia@training.local' AND cm."name" = 'Nokia')
  );

UPDATE "TrainingPlan"
SET "clientMasterId" = (SELECT "id" FROM "ClientMaster" WHERE "name" = 'Avaya' LIMIT 1)
WHERE "clientMasterId" IS NULL;

-- DropForeignKey
ALTER TABLE "TrainingPlan" DROP CONSTRAINT "TrainingPlan_clientId_fkey";

-- AlterTable
ALTER TABLE "TrainingPlan" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "TrainingPlan" ALTER COLUMN "clientMasterId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_clientMasterId_fkey" FOREIGN KEY ("clientMasterId") REFERENCES "ClientMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
