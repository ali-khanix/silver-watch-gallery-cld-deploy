import { prisma } from "@/lib/prisma";
import { verifyBitpayPayment, getBaseUrl } from "@/lib/bitpay";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transId = searchParams.get("trans_id");
  const idGet = searchParams.get("id_get");

  if (!idGet) {
    return NextResponse.redirect(new URL("/cart", getBaseUrl()));
  }

  // paymentAuthority holds Bitpay's id_get, set when the payment was created.
  const order = await prisma.order.findUnique({
    where: { paymentAuthority: idGet },
  });

  if (!order) {
    return NextResponse.redirect(new URL("/cart", getBaseUrl()));
  }

  // No trans_id means the user cancelled or the bank rejected the
  // transaction before Bitpay could complete it.
  if (!transId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
    return NextResponse.redirect(new URL(`/orders/${order.id}`, getBaseUrl()));
  }

  // Already verified previously (e.g. user hit back/refresh on this URL) —
  // don't verify twice, just show the order.
  if (order.paymentStatus === "paid") {
    return NextResponse.redirect(new URL(`/orders/${order.id}`, getBaseUrl()));
  }

  try {
    const result = await verifyBitpayPayment(transId, idGet);

    // status 1 = success, 11 = already verified before (treat as success,
    // don't re-credit). Anything else = failed/invalid transaction.
    if (result.status === 1 || result.status === 11) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "paid",
          paymentRefId: Number(transId) || null,
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
    console.error("Bitpay verification failed:", error);
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
  }

  return NextResponse.redirect(new URL(`/orders/${order.id}`, getBaseUrl()));
}
