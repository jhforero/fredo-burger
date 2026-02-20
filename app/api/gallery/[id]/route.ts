import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { unlink } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (item.cloudinaryId) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(item.cloudinaryId, {
      resource_type: item.type === "VIDEO" ? "video" : "image",
    });
  } else if (item.url.startsWith("/uploads/")) {
    const filepath = path.join(process.cwd(), "public", item.url);
    await unlink(filepath).catch(() => {});
  }

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
