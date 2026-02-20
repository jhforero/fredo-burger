"use client";

import { useState, useEffect, useCallback } from "react";
import VideoPlayer from "./VideoPlayer";

type GalleryItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, close]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-800 cursor-pointer"
          >
            {item.type === "VIDEO" ? (
              <VideoPlayer src={item.url} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.title || "Galería Fredo Burger"}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            )}
            {item.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-sm font-medium text-white">{item.title}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-3xl text-white/70 hover:text-white"
            aria-label="Cerrar"
          >
            &times;
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.type === "VIDEO" ? (
              <video
                src={selected.url}
                className="max-h-[85vh] max-w-[90vw] rounded-lg"
                controls
                autoPlay
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.url}
                alt={selected.title || "Galería Fredo Burger"}
                className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              />
            )}
            {selected.title && (
              <p className="mt-3 text-center text-sm text-zinc-300">
                {selected.title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
