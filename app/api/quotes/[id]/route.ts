import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { event: true, items: { include: { menuItem: true } } },
  });
  if (!quote) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(quote);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const quote = await prisma.quote.update({
    where: { id },
    data: { status: body.status },
    include: { event: true, items: { include: { menuItem: true } } },
  });
  return NextResponse.json(quote);
}
