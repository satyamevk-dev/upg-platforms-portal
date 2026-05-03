-- Map any legacy admin users before enum removal
UPDATE "User" SET "role" = 'super_admin' WHERE "role" = 'admin';

-- Default must be dropped before enum type conversion
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- Recreate enum without admin variant
CREATE TYPE "AuthRole_new" AS ENUM ('super_admin', 'trainer', 'client');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "AuthRole_new" USING ("role"::text::"AuthRole_new");
ALTER TYPE "AuthRole" RENAME TO "AuthRole_old";
ALTER TYPE "AuthRole_new" RENAME TO "AuthRole";
DROP TYPE "AuthRole_old";

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'client';
