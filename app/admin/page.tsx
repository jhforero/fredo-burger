import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let stats = { menuItems: 0, pendingQuotes: 0, totalQuotes: 0, galleryItems: 0 };

  try {
    const [menuItems, pendingQuotes, totalQuotes, galleryItems] = await Promise.all([
      prisma.menuItem.count(),
      prisma.quote.count({ where: { status: "PENDING" } }),
      prisma.quote.count(),
      prisma.galleryItem.count(),
    ]);
    stats = { menuItems, pendingQuotes, totalQuotes, galleryItems };
  } catch {
    // DB not available
  }

  const cards = [
    { label: "Items en Menú", value: stats.menuItems, href: "/admin/menu", color: "text-orange-400" },
    { label: "Cotizaciones Pendientes", value: stats.pendingQuotes, href: "/admin/quotes", color: "text-yellow-400" },
    { label: "Total Cotizaciones", value: stats.totalQuotes, href: "/admin/quotes", color: "text-blue-400" },
    { label: "Items en Galería", value: stats.galleryItems, href: "/admin/gallery", color: "text-green-400" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl bg-zinc-900 p-6 transition hover:bg-zinc-800"
          >
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="mt-1 text-sm text-zinc-400">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
