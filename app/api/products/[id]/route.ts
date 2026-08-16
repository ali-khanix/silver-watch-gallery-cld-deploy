import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    name,
    slug,
    shortDescription,
    description,
    price,
    offer,
    gender,
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
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        shortDescription,
        description,
        price: Number(price),
        offer: offer ? Number(offer) : null,
        gender: gender || null,
        colors,
        features,
        images,
        categoryId,
        brandId: brandId || null,
        inStock: inStock ?? true,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "این اسلاگ قبلا استفاده شده یا محصول یافت نشد" },
      { status: 409 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  }
}
