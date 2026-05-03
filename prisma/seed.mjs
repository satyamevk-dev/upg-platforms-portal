import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Keep default in sync with `lib/platform-owner.ts` (platform owner role is non-editable in UI).
const SUPER_ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL ?? "satyamevk@infinite.com"
)
  .trim()
  .toLowerCase();

const SUPER_ADMIN_NAME = (
  process.env.SUPER_ADMIN_NAME ?? "Satyam EVK"
).trim();

async function main() {
  const password = process.env.SUPER_ADMIN_PASSWORD;
  /** Keep in sync with `lib/password-policy.ts`. */
  const MIN = 8;
  const MAX = 10;
  if (!password || password.length < MIN || password.length > MAX) {
    console.error(
      `Set SUPER_ADMIN_PASSWORD in your environment (${MIN}–${MAX} characters) before running the seed.`,
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  for (const name of ["Avaya", "Tawrid"]) {
    await prisma.clientMaster.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }

  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    create: {
      email: SUPER_ADMIN_EMAIL,
      name: SUPER_ADMIN_NAME,
      passwordHash,
      role: "super_admin",
    },
    update: {
      name: SUPER_ADMIN_NAME,
      passwordHash,
      role: "super_admin",
    },
  });

  const trainerEmail = "trainer@training.local";
  await prisma.user.upsert({
    where: { email: trainerEmail },
    create: {
      email: trainerEmail,
      name: "Trainer",
      passwordHash,
      role: "trainer",
    },
    update: {
      name: "Trainer",
      passwordHash,
      role: "trainer",
    },
  });

  // Predefined plan clients — must match lib/training-plan-clients.ts (Avaya & Tawrid for dropdown).
  for (const row of [
    { email: "avaya@training.local", name: "Avaya" },
    { email: "tawrid@training.local", name: "Tawrid" },
  ]) {
    await prisma.user.upsert({
      where: { email: row.email },
      create: {
        email: row.email,
        name: row.name,
        passwordHash,
        role: "trainee",
      },
      update: {
        name: row.name,
        passwordHash,
        role: "trainee",
      },
    });
  }

  console.log(`Platform Owner ready: ${SUPER_ADMIN_EMAIL}`);
  console.log(`Trainer ready: ${trainerEmail} (same password as SUPER_ADMIN_PASSWORD)`);
  console.log(`ClientMaster ready: Avaya, Tawrid`);
  console.log(`Client portal users ready: avaya@training.local, tawrid@training.local`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
