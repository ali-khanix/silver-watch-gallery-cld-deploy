import { prisma } from "@/lib/prisma";
import { zarinpal } from "@/lib/zarinpal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!authority) {
    return NextResponse.redirect(new URL("/cart", req.url));
  }

  const order = await prisma.order.findUnique({
    where: { paymentAuthority: authority },
  });

  if (!order) {
    return NextResponse.redirect(new URL("/cart", req.url));
  }

  // User cancelled or the bank rejected the transaction before it completed.
  if (status !== "OK") {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
    return NextResponse.redirect(new URL(`/orders/${order.id}`, req.url));
  }

  // Already verified previously (e.g. user hit back/refresh on this URL) —
  // don't verify twice, just show the order.
  if (order.paymentStatus === "paid") {
    return NextResponse.redirect(new URL(`/orders/${order.id}`, req.url));
  }

  try {
    const response = await zarinpal.verifications.verify({
      amount: order.total,
      authority,
    });

    const code = response?.data?.code;

    if (code === 100 || code === 101) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "paid",
          paymentRefId: response.data.ref_id ?? null,
          paidAt: new Date(),
        },
      });
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "failed" },
      });
    }
  } catch (error) {
    console.error("ZarinPal verification failed:", error);
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
  }

  return NextResponse.redirect(new URL(`/orders/${order.id}`, req.url));
}
