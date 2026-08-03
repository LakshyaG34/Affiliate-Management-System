import prisma from "../src/lib/prisma";

async function main() {
  await prisma.commissionSetting.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      commissionPercentage: 10,
      minimumPayoutAmount: 500,
    },
  });

  console.log("🌱 Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });