import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createBitpayPayment, getBaseUrl, getGatewayUrl } from "@/lib/bitpay";
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
    // order.total is stored/displayed in Toman; Bitpay expects Rial.
    const amountRial = order.total * 10;

    const result = await createBitpayPayment({
      amountRial,
      redirect: `${getBaseUrl()}/api/payments/callback`,
      name: order.name,
      email: order.email,
      description: `پرداخت سفارش #${order.id}`,
    });

    if (!result.ok) {
      console.error("Bitpay payment request failed with code:", result.errorCode);
      return NextResponse.json(
        { error: "خطا در ایجاد درخواست پرداخت" },
        { status: 502 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentAuthority: result.idGet, paymentStatus: "unpaid" },
    });

    return NextResponse.json({ url: getGatewayUrl(result.idGet) });
  } catch (error) {
    console.error("Bitpay payment request failed:", error);
    return NextResponse.json(
      { error: "ارتباط با درگاه پرداخت برقرار نشد" },
      { status: 502 }
    );
  }
}
