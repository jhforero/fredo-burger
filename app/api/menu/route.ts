import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      cloudinaryId: body.cloudinaryId,
      categoryId: body.categoryId,
      available: body.available ?? true,
    },
    include: { category: true },
  });
  return NextResponse.json(item, { status: 201 });
}
