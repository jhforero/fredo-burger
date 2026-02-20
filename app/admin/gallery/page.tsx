"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  title: string | null;
  url: string;
  type: "IMAGE" | "VIDEO";
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  function fetchItems() {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          url: uploadData.url,
          type: uploadData.type,
          cloudinaryId: uploadData.cloudinaryId,
        }),
      });

      setTitle("");
      fetchItems();
    } catch {
      alert("Error al subir archivo");
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este archivo?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Galería</h1>

      {/* Upload form */}
      <div className="mb-8 rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Subir archivo</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Título (opcional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
              placeholder="Descripción de la foto/video"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Archivo</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleUpload}
              disabled={uploading}
              className="text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-white file:hover:bg-orange-700 disabled:opacity-50"
            />
          </div>
          {uploading && <p className="text-sm text-zinc-400">Subiendo...</p>}
        </div>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <p className="text-zinc-400">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-zinc-500">No hay archivos en la galería.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl bg-zinc-900">
              <div className="aspect-square">
                {item.type === "VIDEO" ? (
                  <video src={item.url} className="h-full w-full object-cover" controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.title || ""} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="truncate text-sm text-zinc-400">
                  {item.title || (item.type === "VIDEO" ? "Video" : "Foto")}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-400 opacity-0 transition group-hover:opacity-100 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
