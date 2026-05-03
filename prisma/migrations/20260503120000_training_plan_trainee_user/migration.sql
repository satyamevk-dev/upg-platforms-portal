-- AlterTable
ALTER TABLE "TrainingPlan" ADD COLUMN "traineeUserId" TEXT;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_traineeUserId_fkey" FOREIGN KEY ("traineeUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
