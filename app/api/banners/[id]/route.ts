import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, imageUrl, link, size } = await req.json();

  if (size && size !== "large" && size !== "small") {
    return NextResponse.json(
      { error: "اندازه بنر نامعتبر است" },
      { status: 400 }
    );
  }

  try {
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(size !== undefined && { size }),
        link: link || null,
      },
    });
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "بنر یافت نشد" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "بنر یافت نشد" }, { status: 404 });
  }
}
