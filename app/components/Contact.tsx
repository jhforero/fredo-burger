"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
          guests: Number(data.get("guests")) || 10,
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
          <span className="text-orange-500">Contáctanos</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-zinc-400">
          Cuéntanos sobre tu evento y te enviaremos una cotización personalizada.
        </p>

        {status === "sent" ? (
          <div className="rounded-xl bg-green-500/10 p-8 text-center">
            <p className="text-xl font-semibold text-green-400">
              ¡Mensaje enviado!
            </p>
            <p className="mt-2 text-zinc-400">
              Te contactaremos pronto con tu cotización.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-orange-400 underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm text-zinc-300">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm text-zinc-300">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="+57 000 000 000"
                />
              </div>
              <div>
                <label htmlFor="guests" className="mb-1 block text-sm text-zinc-300">
                  Número de personas
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-zinc-300">
                Cuéntanos sobre tu evento
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                placeholder="Tipo de evento, fecha, preferencias especiales..."
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
              className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {status === "sending" ? "Enviando..." : "Enviar Cotización"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
