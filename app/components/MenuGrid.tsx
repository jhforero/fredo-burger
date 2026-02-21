"use client";

import { useState } from "react";

type CategoryWithItems = {
  name: string;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
  }[];
};

export default function MenuGrid({ categories }: { categories: CategoryWithItems[] }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
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
                        className="h-40 w-full cursor-pointer object-cover transition hover:opacity-80"
                        onClick={() => setLightbox({ src: item.image!, alt: item.name })}
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-3xl text-white/70 transition hover:text-white"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-lg font-semibold text-white/80">
            {lightbox.alt}
          </p>
        </div>
      )}
    </>
  );
}
