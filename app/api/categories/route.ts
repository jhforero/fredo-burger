import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { items: true },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const category = await prisma.category.create({
    data: { name: body.name, order: body.order || 0 },
  });
  return NextResponse.json(category, { status: 201 });
}
