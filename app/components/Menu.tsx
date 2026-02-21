import prisma from "@/lib/prisma";
import Link from "next/link";
import MenuGrid from "./MenuGrid";

export default async function Menu() {
  let categories: { name: string; items: { id: string; name: string; description: string | null; price: number; image: string | null; available: boolean }[] }[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { available: true },
          orderBy: { name: "asc" },
          take: 4,
        },
      },
    });
  } catch {
    // DB not available yet
  }

  return (
    <section id="menu" className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
          Nuestro <span className="text-orange-500">Menú</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-400">
          Selección de nuestros mejores cortes y acompañamientos preparados en
          parrilla.
        </p>

        {categories.length === 0 ? (
          <div className="text-center">
            <p className="mb-6 text-zinc-500">
              El menú se está preparando. Pronto podrás ver nuestros platos.
            </p>
            <Link
              href="/cotizar"
              className="inline-block rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Solicitar Información
            </Link>
          </div>
        ) : (
          <MenuGrid categories={categories} />
        )}
      </div>
    </section>
  );
}
