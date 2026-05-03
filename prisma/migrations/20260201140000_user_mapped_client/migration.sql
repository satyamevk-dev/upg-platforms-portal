-- AlterTable
ALTER TABLE "User" ADD COLUMN "mappedClientId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mappedClientId_fkey" FOREIGN KEY ("mappedClientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
