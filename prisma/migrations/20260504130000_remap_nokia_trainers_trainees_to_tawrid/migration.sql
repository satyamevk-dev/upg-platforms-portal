-- Remap portal trainers and trainees from ClientMaster "Nokia" to "Tawrid".
-- No-op if either master row is missing (e.g. already renamed or fresh seed with only Tawrid).
-- Does not change TrainingPlan.clientMasterId; reassign plans in the app if those should move too.

DO $$
DECLARE
  nokia_id TEXT;
  tawrid_id TEXT;
BEGIN
  SELECT "id" INTO nokia_id FROM "ClientMaster" WHERE "name" = 'Nokia' LIMIT 1;
  SELECT "id" INTO tawrid_id FROM "ClientMaster" WHERE "name" = 'Tawrid' LIMIT 1;

  IF nokia_id IS NULL OR tawrid_id IS NULL THEN
    RAISE NOTICE 'remap_nokia_to_tawrid: skipped (Nokia id=%, Tawrid id=%).', nokia_id, tawrid_id;
    RETURN;
  END IF;

  IF nokia_id = tawrid_id THEN
    RETURN;
  END IF;

  UPDATE "User"
  SET
    "mappedMasterClientId" = tawrid_id,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE "mappedMasterClientId" = nokia_id
    AND "role" IN ('trainer', 'trainee');
END $$;
