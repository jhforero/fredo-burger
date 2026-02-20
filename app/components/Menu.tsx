import prisma from "@/lib/prisma";
import Link from "next/link";

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
          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h3 className="mb-4 text-xl font-semibold text-orange-400">
                  {cat.name}
                </h3>
                {cat.items.length === 0 ? (
                  <p className="text-sm text-zinc-500">Próximamente</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-xl bg-zinc-800 transition hover:bg-zinc-700"
                      >
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-40 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center bg-zinc-700/50 text-3xl">
                            🥩
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-white">{item.name}</h4>
                          {item.description && (
                            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <p className="mt-2 text-lg font-bold text-orange-500">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
