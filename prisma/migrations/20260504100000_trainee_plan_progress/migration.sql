-- CreateEnum
CREATE TYPE "TraineePlanProgressStatus" AS ENUM ('not_started', 'in_progress', 'paused', 'completed');

-- CreateTable
CREATE TABLE "TraineePlanProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainingPlanId" TEXT NOT NULL,
    "status" "TraineePlanProgressStatus" NOT NULL DEFAULT 'not_started',
    "highestCompletedOrder" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TraineePlanProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TraineePlanProgress_userId_trainingPlanId_key" ON "TraineePlanProgress"("userId", "trainingPlanId");

-- AddForeignKey
ALTER TABLE "TraineePlanProgress" ADD CONSTRAINT "TraineePlanProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineePlanProgress" ADD CONSTRAINT "TraineePlanProgress_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
