-- CreateTable
CREATE TABLE "ClientMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientMaster_name_key" ON "ClientMaster"("name");

-- Master rows (stable ids for reproducible local/dev DBs)
INSERT INTO "ClientMaster" ("id", "name", "createdAt", "updatedAt")
VALUES
    ('cm_seed_avaya', 'Avaya', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cm_seed_nokia', 'Nokia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "User" ADD COLUMN "mappedMasterClientId" TEXT;

-- Backfill from former self-referential mapped client (match Avaya/Nokia portal users by name)
UPDATE "User" AS u
SET "mappedMasterClientId" = cm."id"
FROM "ClientMaster" AS cm, "User" AS mu
WHERE u."mappedClientId" = mu."id"
  AND cm."name" = mu."name"
  AND mu."name" IN ('Avaya', 'Nokia');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_mappedClientId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mappedClientId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mappedMasterClientId_fkey" FOREIGN KEY ("mappedMasterClientId") REFERENCES "ClientMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
