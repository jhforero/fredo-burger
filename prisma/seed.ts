import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@fredoburger.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (!existing) {
    const hash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { email, password: hash, name: "Fredo Admin" },
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log("Admin already exists");
  }

  const categories = [
    { name: "Parrilla", order: 1 },
    { name: "Acompañamientos", order: 2 },
    { name: "Bebidas", order: 3 },
    { name: "Postres", order: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log("Categories seeded");

  const events = [
    { name: "Corporativo", description: "Eventos empresariales y reuniones de trabajo" },
    { name: "Cumpleaños", description: "Celebraciones de cumpleaños" },
    { name: "Boda", description: "Bodas y recepciones nupciales" },
    { name: "Reunión familiar", description: "Reuniones y celebraciones familiares" },
    { name: "Otro", description: "Otros tipos de eventos" },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { name: event.name },
      update: {},
      create: event,
    });
  }
  console.log("Events seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
