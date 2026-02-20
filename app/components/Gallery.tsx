import prisma from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export default async function Gallery() {
  let items: { id: string; title: string | null; url: string; type: string }[] = [];

  try {
    items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch {
    // DB not available yet
  }

  return (
    <section id="galeria" className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
          <span className="text-orange-500">Galería</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-400">
          Así se vive la experiencia Fredo Burger. Fotos y videos de nuestros
          eventos.
        </p>

        {items.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl bg-zinc-800 text-4xl"
              >
                {["🥩", "🔥", "🍖", "🎉"][i]}
              </div>
            ))}
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}
      </div>
    </section>
  );
}
