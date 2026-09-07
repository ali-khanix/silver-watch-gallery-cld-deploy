import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 }
    );
  }

  const { name, image } = await req.json();

  const data: { name?: string; image?: string } = {};
  if (typeof name === "string" && name.trim()) data.name = name.trim();
  if (typeof image === "string" && image.trim()) data.image = image.trim();

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "داده‌ای برای ذخیره ارسال نشده" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data,
  });

  return NextResponse.json({ user });
}
