import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const item = await prisma.galleryItem.create({
    data: {
      title: body.title,
      url: body.url,
      type: body.type,
      cloudinaryId: body.cloudinaryId,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
