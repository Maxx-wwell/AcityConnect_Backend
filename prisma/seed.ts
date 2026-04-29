import "dotenv/config";
import { CategoryType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultAllowedDomains = ["acity.edu.gh"];

async function main() {
  for (const domain of defaultAllowedDomains) {
    await prisma.allowedEmailDomain.upsert({
      where: { domain },
      update: { isActive: true },
      create: { domain, isActive: true },
    });
  }

  await prisma.category.upsert({
    where: { name: "General Items" },
    update: {},
    create: { name: "General Items", type: CategoryType.ITEM },
  });

  await prisma.category.upsert({
    where: { name: "General Skills" },
    update: {},
    create: { name: "General Skills", type: CategoryType.SKILL },
  });

  console.log(
    `Seed complete. Allowed domains ensured: ${defaultAllowedDomains.join(", ")}`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
