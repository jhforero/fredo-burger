import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  const items = [
    // Parrilla
    { name: "Asado de Tira", description: "Corte clásico argentino a la parrilla con chimichurri casero", price: 18500, categoryId: catMap["Parrilla"] },
    { name: "Chorizo Criollo", description: "Chorizo artesanal a la brasa con pan casero", price: 8500, categoryId: catMap["Parrilla"] },
    { name: "Entraña", description: "Entraña jugosa a punto, marinada en especias", price: 22000, categoryId: catMap["Parrilla"] },
    { name: "Vacío", description: "Vacío tierno cocinado lento al carbón", price: 20000, categoryId: catMap["Parrilla"] },
    { name: "Costillas BBQ", description: "Costillas glaseadas con salsa BBQ ahumada", price: 19000, categoryId: catMap["Parrilla"] },
    { name: "Pollo a la Parrilla", description: "Medio pollo marinado en hierbas y limón", price: 12000, categoryId: catMap["Parrilla"] },
    { name: "Hamburguesa Fredo", description: "Hamburguesa artesanal 200g con queso cheddar y bacon", price: 14000, categoryId: catMap["Parrilla"] },
    { name: "Morcilla", description: "Morcilla criolla a la parrilla", price: 7500, categoryId: catMap["Parrilla"] },
    // Acompañamientos
    { name: "Ensalada César", description: "Lechuga romana, crutones, parmesano y aderezo césar", price: 8000, categoryId: catMap["Acompañamientos"] },
    { name: "Papas Rústicas", description: "Papas al horno con romero y ajo", price: 6500, categoryId: catMap["Acompañamientos"] },
    { name: "Ensalada Mixta", description: "Tomate, lechuga, cebolla y zanahoria rallada", price: 5500, categoryId: catMap["Acompañamientos"] },
    { name: "Provoleta", description: "Provolone fundido a la parrilla con orégano", price: 9000, categoryId: catMap["Acompañamientos"] },
    { name: "Pan de Ajo", description: "Pan artesanal con mantequilla de ajo y perejil", price: 4500, categoryId: catMap["Acompañamientos"] },
    // Bebidas
    { name: "Limonada Natural", description: "Limonada fresca con menta", price: 4000, categoryId: catMap["Bebidas"] },
    { name: "Agua Mineral", description: "Botella 500ml", price: 2500, categoryId: catMap["Bebidas"] },
    { name: "Cerveza Artesanal", description: "Pinta de cerveza rubia o roja artesanal", price: 6000, categoryId: catMap["Bebidas"] },
    { name: "Vino Malbec", description: "Copa de Malbec selección especial", price: 7000, categoryId: catMap["Bebidas"] },
    { name: "Gaseosa", description: "Coca-Cola, Sprite o Fanta 350ml", price: 3000, categoryId: catMap["Bebidas"] },
    // Postres
    { name: "Flan Casero", description: "Flan de huevo con dulce de leche y crema", price: 6000, categoryId: catMap["Postres"] },
    { name: "Brownie con Helado", description: "Brownie de chocolate tibio con helado de vainilla", price: 7500, categoryId: catMap["Postres"] },
    { name: "Fruta de Estación", description: "Selección de frutas frescas de temporada", price: 5000, categoryId: catMap["Postres"] },
  ];

  for (const item of items) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`${items.length} menu items created`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
