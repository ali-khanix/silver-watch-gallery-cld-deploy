import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    slug,
    shortDescription,
    description,
    price,
    offer,
    colors,
    features,
    images,
    categoryId,
    brandId,
    inStock,
  } = body;

  if (!name || !slug || !price || !categoryId) {
    return NextResponse.json(
      { error: "فیلدهای الزامی را پر کنید" },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        shortDescription,
        description,
        price: Number(price),
        offer: offer ? Number(offer) : null,
        colors,
        features,
        images,
        categoryId,
        brandId: brandId || null,
        inStock: inStock ?? true,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "این اسلاگ قبلا استفاده شده" },
      { status: 409 }
    );
  }
}
