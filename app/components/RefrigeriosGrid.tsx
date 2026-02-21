"use client";

import { useState } from "react";
import Link from "next/link";

type RefrigerioItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
};

export default function RefrigeriosGrid({ items }: { items: RefrigerioItem[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function updateQty(id: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  const selected = Object.entries(quantities).filter(([, qty]) => qty > 0);
  const total = selected.reduce((sum, [id, qty]) => {
    const item = items.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const totalUnits = selected.reduce((sum, [, qty]) => sum + qty, 0);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`overflow-hidden rounded-xl border-2 transition ${
                qty > 0
                  ? "border-orange-500 bg-zinc-800"
                  : "border-transparent bg-zinc-800 hover:border-zinc-700"
              }`}
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-zinc-700/50 text-5xl">
                  📦
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                )}
                <p className="mt-2 text-xl font-bold text-orange-500">
                  ${item.price.toLocaleString()}
                  <span className="text-sm font-normal text-zinc-500"> /unidad</span>
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    disabled={qty === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-700 text-lg font-bold text-white transition hover:bg-zinc-600 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-lg font-semibold text-white">
                    {qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-lg font-bold text-white transition hover:bg-orange-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      {selected.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-zinc-800 p-6 sm:flex-row">
          <div>
            <p className="text-white">
              <span className="text-2xl font-bold text-orange-500">{totalUnits}</span>{" "}
              {totalUnits === 1 ? "refrigerio" : "refrigerios"} seleccionados
            </p>
            <p className="text-sm text-zinc-400">
              Total estimado:{" "}
              <span className="font-semibold text-white">
                ${total.toLocaleString()}
              </span>
            </p>
          </div>
          <Link
            href={`/cotizar?refrigerios=${encodeURIComponent(
              JSON.stringify(
                selected.map(([id, qty]) => ({ menuItemId: id, quantity: qty }))
              )
            )}`}
            className="rounded-full bg-orange-600 px-8 py-3 font-bold text-white transition hover:bg-orange-700"
          >
            Cotizar Refrigerios
          </Link>
        </div>
      )}
    </>
  );
}
