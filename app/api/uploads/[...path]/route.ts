// app/api/uploads/[...path]/route.ts
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const filePath = path.join(process.cwd(), "uploads", ...segments);

  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type =
      {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".gif": "image/gif",
      }[ext] ?? "application/octet-stream";
    return new NextResponse(file, { headers: { "Content-Type": type } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
