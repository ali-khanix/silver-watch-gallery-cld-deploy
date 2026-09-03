import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { normalizeImages } from "@/lib/normalize-images";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const results = products.map((p) => ({
    ...p,
    images: normalizeImages(p.images as any),
  }));

  return NextResponse.json(results);
}
