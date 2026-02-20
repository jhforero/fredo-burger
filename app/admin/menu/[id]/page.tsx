"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Category = { id: string; name: string };

export default function EditMenuItemPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    available: true,
    image: "",
    cloudinaryId: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats) => {
        setCategories(cats);
        if (isNew && cats.length > 0) {
          setForm((f) => ({ ...f, categoryId: cats[0].id }));
        }
      });

    if (!isNew) {
      fetch(`/api/menu/${id}`)
        .then((r) => r.json())
        .then((item) => {
          setForm({
            name: item.name,
            description: item.description || "",
            price: String(item.price),
            categoryId: item.categoryId,
            available: item.available,
            image: item.image || "",
            cloudinaryId: item.cloudinaryId || "",
          });
        });
    }
  }, [id, isNew]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setForm((f) => ({ ...f, image: data.url, cloudinaryId: data.cloudinaryId }));
    } catch {
      alert("Error al subir imagen");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      categoryId: form.categoryId,
      available: form.available,
      image: form.image || null,
      cloudinaryId: form.cloudinaryId || null,
    };

    const url = isNew ? "/api/menu" : `/api/menu/${id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/menu");
    } else {
      alert("Error al guardar");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">
        {isNew ? "Nuevo Item" : "Editar Item"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Nombre *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-300">Descripción</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Precio *</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Categoría *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-300">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-white file:hover:bg-zinc-600"
          />
          {uploading && <p className="mt-1 text-sm text-zinc-400">Subiendo...</p>}
          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="rounded accent-orange-500"
          />
          <label htmlFor="available" className="text-sm text-zinc-300">Disponible</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-600 px-6 py-2.5 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/menu")}
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-zinc-300 hover:bg-zinc-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
