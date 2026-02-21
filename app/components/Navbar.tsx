"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#menu", label: "Menú" },
  { href: "#refrigerios", label: "Refrigerios" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-orange-500">
          Fredo Burger
        </Link>

        {/* Desktop */}
        <div className="hidden gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-300 transition hover:text-orange-400"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/cotizar"
            className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Cotizar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-zinc-300 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-zinc-300 transition hover:text-orange-400"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/cotizar"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-orange-600 px-4 py-2 text-center font-semibold text-white"
          >
            Cotizar
          </Link>
        </div>
      )}
    </nav>
  );
}
