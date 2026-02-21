import prisma from "@/lib/prisma";
import RefrigeriosGrid from "./RefrigeriosGrid";

export default async function Refrigerios() {
  let items: { id: string; name: string; description: string | null; price: number; image: string | null }[] = [];

  try {
    const category = await prisma.category.findUnique({
      where: { name: "Refrigerios" },
      include: {
        items: {
          where: { available: true },
          orderBy: { name: "asc" },
        },
      },
    });
    if (category) items = category.items;
  } catch {
    // DB not available yet
  }

  return (
    <section id="refrigerios" className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
          <span className="text-orange-500">Refrigerios</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-400">
          Cajas individuales listas para entregar en tu evento. Elige los que más
          te gusten y la cantidad que necesites.
        </p>

        {items.length === 0 ? (
          <p className="text-center text-zinc-500">
            Próximamente disponibles. Contáctanos para más información.
          </p>
        ) : (
          <RefrigeriosGrid items={items} />
        )}
      </div>
    </section>
  );
}
