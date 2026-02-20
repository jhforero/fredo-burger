"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Quote = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  status: string;
  createdAt: string;
  event?: { name: string } | null;
};

const statusLabels: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Pendiente", class: "bg-yellow-500/20 text-yellow-400" },
  RESPONDED: { label: "Respondida", class: "bg-blue-500/20 text-blue-400" },
  ACCEPTED: { label: "Aceptada", class: "bg-green-500/20 text-green-400" },
  REJECTED: { label: "Rechazada", class: "bg-red-500/20 text-red-400" },
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quotes")
      .then((r) => r.json())
      .then(setQuotes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Cotizaciones</h1>

      {loading ? (
        <p className="text-zinc-400">Cargando...</p>
      ) : quotes.length === 0 ? (
        <p className="text-zinc-500">No hay cotizaciones.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Personas</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{q.name}</p>
                    <p className="text-xs text-zinc-500">{q.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {q.event?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{q.guests}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusLabels[q.status]?.class || ""}`}>
                      {statusLabels[q.status]?.label || q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(q.createdAt).toLocaleDateString("es")}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/quotes/${q.id}`} className="text-blue-400 hover:underline">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
