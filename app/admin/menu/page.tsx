"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

type MenuItem = {
  id: string;
  name: string;
  image: string | null;
  price: number;
  available: boolean;
  category: { name: string };
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category.name))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !categoryFilter || item.category.name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este item?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menú</h1>
        <Link
          href="/admin/menu/new"
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          + Nuevo Item
        </Link>
      </div>

      {/* Search & filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-400">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-zinc-500">No hay items en el menú.</p>
      ) : filtered.length === 0 ? (
        <p className="text-zinc-500">No se encontraron resultados.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-zinc-500">
            {filtered.length} de {items.length} items
          </p>
          <div className="overflow-x-auto rounded-xl bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-800/50">
                    <td className="px-4 py-3">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-sm">🥩</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{item.category.name}</td>
                    <td className="px-4 py-3 text-orange-400">${item.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${item.available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {item.available ? "Disponible" : "No disponible"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/menu/${item.id}`} className="text-blue-400 hover:underline">
                          Editar
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
