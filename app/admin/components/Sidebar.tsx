"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/menu", label: "Menú", icon: "🍖" },
  { href: "/admin/gallery", label: "Galería", icon: "📷" },
  { href: "/admin/quotes", label: "Cotizaciones", icon: "📋" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-4">
        <Link href="/admin" className="text-lg font-bold text-orange-500">
          Fredo Admin
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-orange-600/20 text-orange-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 p-4">
        <Link href="/" className="mb-2 block text-sm text-zinc-500 hover:text-zinc-300">
          Ver sitio
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
