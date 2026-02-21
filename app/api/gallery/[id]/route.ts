import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { del } from "@vercel/blob";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Delete the file from storage
  try {
    if (item.url.includes("blob.vercel-storage.com")) {
      // Vercel Blob
      await del(item.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } else if (item.url.startsWith("/uploads/")) {
      // Local file
      const filepath = path.join(process.cwd(), "public", item.url);
      await unlink(filepath).catch(() => {});
    }
  } catch {
    // Continue with DB deletion even if file deletion fails
  }

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
