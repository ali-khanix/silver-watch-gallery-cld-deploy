import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, slug, logo } = await req.json();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "نام و اسلاگ الزامی است" },
      { status: 400 }
    );
  }

  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: { name, slug, logo: logo ?? null },
    });
    return NextResponse.json(brand);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "این اسلاگ قبلا استفاده شده" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "برند یافت نشد" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const productsWithBrand = await prisma.product.count({
    where: { brandId: id },
  });

  if (productsWithBrand > 0) {
    return NextResponse.json(
      {
        error: `این برند ${productsWithBrand} محصول دارد. ابتدا محصولات را حذف یا جابجا کنید`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "برند یافت نشد" }, { status: 404 });
  }
}
