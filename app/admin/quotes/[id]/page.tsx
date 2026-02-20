"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type QuoteDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  message: string | null;
  status: string;
  eventDate: string | null;
  createdAt: string;
  event?: { name: string } | null;
  items: { id: string; quantity: number; menuItem: { name: string; price: number } }[];
};

const statuses = ["PENDING", "RESPONDED", "ACCEPTED", "REJECTED"];
const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  RESPONDED: "Respondida",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
};

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/quotes/${id}`)
      .then((r) => r.json())
      .then(setQuote)
      .catch(() => router.push("/admin/quotes"));
  }, [id, router]);

  async function updateStatus(status: string) {
    setUpdating(true);
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setQuote(updated);
    }
    setUpdating(false);
  }

  if (!quote) return <p className="text-zinc-400">Cargando...</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/admin/quotes")}
        className="mb-6 text-sm text-orange-400 hover:underline"
      >
        &larr; Volver a cotizaciones
      </button>

      <div className="rounded-xl bg-zinc-900 p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{quote.name}</h1>
            <p className="text-sm text-zinc-400">
              {new Date(quote.createdAt).toLocaleDateString("es", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <select
            value={quote.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-zinc-500">Email</p>
            <p className="text-white">{quote.email}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Teléfono</p>
            <p className="text-white">{quote.phone}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Tipo de Evento</p>
            <p className="text-white">{quote.event?.name || "No especificado"}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Personas</p>
            <p className="text-white">{quote.guests}</p>
          </div>
          {quote.eventDate && (
            <div>
              <p className="text-xs text-zinc-500">Fecha del Evento</p>
              <p className="text-white">
                {new Date(quote.eventDate).toLocaleDateString("es")}
              </p>
            </div>
          )}
        </div>

        {quote.message && (
          <div className="mt-6">
            <p className="text-xs text-zinc-500">Mensaje</p>
            <p className="mt-1 whitespace-pre-wrap text-zinc-300">{quote.message}</p>
          </div>
        )}

        {quote.items.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs text-zinc-500">Items seleccionados</p>
            <div className="space-y-1">
              {quote.items.map((item) => (
                <div key={item.id} className="flex justify-between rounded-lg bg-zinc-800 px-3 py-2 text-sm">
                  <span className="text-white">
                    {item.menuItem.name} x{item.quantity}
                  </span>
                  <span className="text-orange-400">
                    ${(item.menuItem.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
