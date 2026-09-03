import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MAX_BANNERS = 30;

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  const { title, imageUrl, link, size } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
  }
  if (!imageUrl) {
    return NextResponse.json({ error: "تصویر الزامی است" }, { status: 400 });
  }
  if (size !== "large" && size !== "small") {
    return NextResponse.json(
      { error: "اندازه بنر نامعتبر است" },
      { status: 400 }
    );
  }

  const count = await prisma.banner.count();
  if (count >= MAX_BANNERS) {
    return NextResponse.json(
      { error: `حداکثر ${MAX_BANNERS} بنر مجاز است` },
      { status: 409 }
    );
  }

  const banner = await prisma.banner.create({
    data: { title, imageUrl, link: link || null, size, order: count },
  });
  return NextResponse.json(banner, { status: 201 });
}
