// seed.js
import prisma from "./config/db.js";

async function main() {
  const categorys = [
    "Électroménager",
    "Petit Électroménager",
    "Climatisation & Confort",
    "TV & Électronique"
  ];

  for (const name of categorys) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ ccategorys seeded!");
}
main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
