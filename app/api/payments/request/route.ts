import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { zarinpal, getBaseUrl } from "@/lib/zarinpal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const orderId = body?.orderId;

  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json(
      { error: "شناسه سفارش نامعتبر است" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.userId !== user.id) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json(
      { error: "این سفارش قبلاً پرداخت شده است" },
      { status: 400 }
    );
  }

  try {
    const response = await zarinpal.payments.create({
      amount: order.total,
      callback_url: `${getBaseUrl()}/api/payments/callback`,
      description: `پرداخت سفارش #${order.id}`,
      mobile: order.phone,
      email: order.email,
    });

    if (response?.data?.code !== 100 || !response?.data?.authority) {
      return NextResponse.json(
        { error: "خطا در ایجاد درخواست پرداخت", details: response?.errors },
        { status: 502 }
      );
    }

    const authority = response.data.authority as string;

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentAuthority: authority, paymentStatus: "unpaid" },
    });

    return NextResponse.json({
      url: zarinpal.payments.getRedirectUrl(authority),
    });
  } catch (error) {
    console.error("ZarinPal payment request failed:", error);
    return NextResponse.json(
      { error: "ارتباط با درگاه پرداخت برقرار نشد" },
      { status: 502 }
    );
  }
}
