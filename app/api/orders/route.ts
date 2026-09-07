import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { shipping, items } = body;

  if (
    !shipping?.name ||
    !shipping?.email ||
    !shipping?.phone ||
    !shipping?.address ||
    !shipping?.city
  ) {
    return NextResponse.json(
      { error: "اطلاعات ارسال ناقص است" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
  }

  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.1);
  const shippingCost = 100000;
  const total = subtotal - discount + shippingCost;

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      name: shipping.name,
      email: shipping.email,
      phone: shipping.phone,
      address: shipping.address,
      city: shipping.city,
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      items: {
        create: items.map((item: any) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.selectedColor,
          image: item.images?.[item.selectedColor]?.[0] ?? null,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
