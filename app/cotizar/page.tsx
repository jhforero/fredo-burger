"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type EventType = { id: string; name: string };
type MenuItemType = { id: string; name: string; price: number; category: { name: string } };

export default function CotizarPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats) => {
        const items: MenuItemType[] = [];
        for (const cat of cats) {
          for (const item of cat.items) {
            items.push({ ...item, category: { name: cat.name } });
          }
        }
        setMenuItems(items);
      })
      .catch(() => {});

    fetch("/api/quotes")
      .catch(() => {});

    // Fetch events from a simple inline approach
    // Events are seeded, so we hardcode the list for client usage
    setEvents([
      { id: "corporativo", name: "Corporativo" },
      { id: "cumpleanos", name: "Cumpleaños" },
      { id: "boda", name: "Boda" },
      { id: "reunion", name: "Reunión familiar" },
      { id: "otro", name: "Otro" },
    ]);
  }, []);

  function toggleItem(id: string) {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = 1;
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          eventDate: data.get("eventDate") || null,
          guests: Number(data.get("guests")) || 10,
          message: data.get("message"),
          items: Object.entries(selectedItems).map(([menuItemId, quantity]) => ({
            menuItemId,
            quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            ¡Cotización enviada!
          </h1>
          <p className="mb-6 text-zinc-400">
            Hemos recibido tu solicitud. Te contactaremos pronto con los
            detalles y precios para tu evento.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 pt-8 pb-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/" className="mb-8 inline-block text-sm text-orange-400 hover:underline">
          &larr; Volver al inicio
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white">
          Cotiza tu <span className="text-orange-500">Evento</span>
        </h1>
        <p className="mb-8 text-zinc-400">
          Completa el formulario y te enviaremos una cotización personalizada.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="rounded-xl bg-zinc-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Datos de Contacto
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm text-zinc-300">Nombre *</label>
                <input id="name" name="name" required className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-zinc-300">Email *</label>
                <input id="email" name="email" type="email" required className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm text-zinc-300">Teléfono *</label>
                <input id="phone" name="phone" required className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="rounded-xl bg-zinc-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Detalles del Evento
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="eventType" className="mb-1 block text-sm text-zinc-300">Tipo de evento</label>
                <select id="eventType" name="eventType" className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none">
                  <option value="">Seleccionar...</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="guests" className="mb-1 block text-sm text-zinc-300">Personas *</label>
                <input id="guests" name="guests" type="number" min="1" required className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none" placeholder="50" />
              </div>
              <div>
                <label htmlFor="eventDate" className="mb-1 block text-sm text-zinc-300">Fecha del evento</label>
                <input id="eventDate" name="eventDate" type="date" className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Menu selection */}
          {menuItems.length > 0 && (
            <div className="rounded-xl bg-zinc-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Selecciona del Menú (opcional)
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`rounded-lg border p-3 text-left transition ${
                      selectedItems[item.id]
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-zinc-600 hover:border-zinc-500"
                    }`}
                  >
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="ml-2 text-sm text-orange-400">
                      ${item.price.toLocaleString()}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      {item.category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="rounded-xl bg-zinc-800 p-6">
            <label htmlFor="message" className="mb-2 block text-lg font-semibold text-white">
              Mensaje adicional
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
              placeholder="Detalles adicionales, preferencias, restricciones alimentarias..."
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400">
              Error al enviar. Intenta de nuevo.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-orange-600 py-3 text-lg font-bold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {status === "sending" ? "Enviando..." : "Enviar Cotización"}
          </button>
        </form>
      </div>
    </div>
  );
}
