-- Study progress was briefly a separate column; fold into `completedEntryIds` and drop the column.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'TraineePlanProgress'
      AND column_name = 'studiedEntryIds'
  ) THEN
    UPDATE "TraineePlanProgress" AS t
    SET "completedEntryIds" = sub.merged
    FROM (
      SELECT
        t2.id,
        COALESCE(
          ARRAY(
            SELECT DISTINCT v
            FROM (
              SELECT unnest(COALESCE(t2."completedEntryIds", ARRAY[]::TEXT[])) AS v
              UNION ALL
              SELECT ('__trainee_study__:' || s)::TEXT AS v
              FROM unnest(COALESCE(t2."studiedEntryIds", ARRAY[]::TEXT[])) AS s
            ) AS u
            WHERE v IS NOT NULL AND trim(v) <> ''
          ),
          ARRAY[]::TEXT[]
        ) AS merged
      FROM "TraineePlanProgress" AS t2
    ) AS sub
    WHERE t.id = sub.id;

    ALTER TABLE "TraineePlanProgress" DROP COLUMN "studiedEntryIds";
  END IF;
END $$;
