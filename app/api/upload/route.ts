import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const ext = path.extname(file.name) || (isVideo ? ".mp4" : ".jpg");
  const filename = `fredo-burger/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  // Use Vercel Blob if BLOB_READ_WRITE_TOKEN is available (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(filename, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return NextResponse.json({
        url: blob.url,
        cloudinaryId: null,
        type: isVideo ? "VIDEO" : "IMAGE",
      });
    } catch (err) {
      console.error("Vercel Blob upload error:", err);
      return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
  }

  // Fallback: local upload (development only)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const localFilename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filepath = path.join(uploadsDir, localFilename);
  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: `/uploads/${localFilename}`,
    cloudinaryId: null,
    type: isVideo ? "VIDEO" : "IMAGE",
  });
}
