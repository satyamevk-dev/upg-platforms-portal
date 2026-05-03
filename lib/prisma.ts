import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}

/** Dev HMR can keep an old global client generated before `prisma generate`, missing new delegates (e.g. `traineePlanProgress`). */
function isStaleClient(client: PrismaClient): boolean {
  return !(
    "traineePlanProgress" in client &&
    typeof (client as unknown as { traineePlanProgress?: { findUnique: unknown } }).traineePlanProgress
      ?.findUnique === "function"
  );
}

function resolvePrisma(): PrismaClient {
  const cached = globalForPrisma.prisma;

  if (
    process.env.NODE_ENV !== "production" &&
    cached !== undefined &&
    isStaleClient(cached)
  ) {
    void cached.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = resolvePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
