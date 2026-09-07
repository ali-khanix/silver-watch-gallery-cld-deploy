import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.$transaction([
      // Order.userId has ON DELETE RESTRICT, so orders (and their items)
      // must be removed before the user can be deleted.
      prisma.orderItem.deleteMany({ where: { order: { userId: id } } }),
      prisma.order.deleteMany({ where: { userId: id } }),
      // Session rows cascade automatically (ON DELETE CASCADE).
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  }
}
