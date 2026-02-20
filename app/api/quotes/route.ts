import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const quotes = await prisma.quote.findMany({
    include: { event: true, items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(request: Request) {
  const body = await request.json();

  const quote = await prisma.quote.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      eventId: body.eventId || null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      guests: body.guests,
      message: body.message,
      items: body.items?.length
        ? {
            create: body.items.map((item: { menuItemId: string; quantity?: number }) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity || 1,
            })),
          }
        : undefined,
    },
    include: { event: true, items: { include: { menuItem: true } } },
  });

  return NextResponse.json(quote, { status: 201 });
}
