import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ALL_ORDER_STATUSES } from "@/lib/order-status";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!ALL_ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر است" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
}
