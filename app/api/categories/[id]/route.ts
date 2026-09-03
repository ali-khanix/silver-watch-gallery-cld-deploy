import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, slug, group } = await req.json();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "نام و اسلاگ الزامی است" },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, group: group || null },
    });
    return NextResponse.json(category);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "این اسلاگ قبلا استفاده شده" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "دسته بندی یافت نشد" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const productsInCategory = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productsInCategory > 0) {
    return NextResponse.json(
      {
        error: `این دسته بندی ${productsInCategory} محصول دارد. ابتدا محصولات را حذف یا جابجا کنید`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "دسته بندی یافت نشد" }, { status: 404 });
  }
}
