-- Replace enum value `client` with `trainee` (PostgreSQL: new enum + cast + swap)
CREATE TYPE "AuthRole_new" AS ENUM ('super_admin', 'trainer', 'trainee');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User" ALTER COLUMN "role" TYPE "AuthRole_new" USING (
  CASE "role"::text
    WHEN 'client' THEN 'trainee'::"AuthRole_new"
    WHEN 'super_admin' THEN 'super_admin'::"AuthRole_new"
    WHEN 'trainer' THEN 'trainer'::"AuthRole_new"
    ELSE 'trainee'::"AuthRole_new"
  END
);

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'trainee'::"AuthRole_new";

DROP TYPE "AuthRole";

ALTER TYPE "AuthRole_new" RENAME TO "AuthRole";
