import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ualearn.com';

  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    console.error(`Admin user with email "${adminEmail}" not found. Set ADMIN_EMAIL env var to the correct address.`);
    process.exit(1);
  }

  const { count } = await prisma.user.deleteMany({
    where: {
      email: { not: adminEmail },
    },
  });

  console.log(`Deleted ${count} users (kept ${adminEmail}).`);
}

main()
  .catch((error) => {
    console.error('Failed to delete users', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
