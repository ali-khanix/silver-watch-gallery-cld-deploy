import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import PayButton from "@/components/PayButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== user.id) {
    notFound();
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-2">سفارش ثبت شد</h1>
      <p className="text-zinc-500 text-sm mb-4">شماره سفارش: {order.id}</p>

      {order.paymentStatus === "paid" && (
        <div className="bg-green-50 text-green-700 rounded-xl p-4 mb-8 text-sm">
          <p className="font-medium">پرداخت با موفقیت انجام شد.</p>
          {order.paymentRefId && (
            <p className="mt-1">کد پیگیری: {order.paymentRefId}</p>
          )}
        </div>
      )}

      {order.paymentStatus === "failed" && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-8 text-sm flex flex-col gap-3">
          <p>پرداخت ناموفق بود یا لغو شد. می‌توانید دوباره تلاش کنید.</p>
          <PayButton orderId={order.id} />
        </div>
      )}

      {order.paymentStatus === "unpaid" && (
        <div className="bg-zinc-100 rounded-xl p-4 mb-8 flex flex-col gap-3">
          <p className="text-sm text-zinc-500">
            سفارش ثبت شد، برای تکمیل خرید باید مبلغ را پرداخت کنید.
          </p>
          <PayButton orderId={order.id} />
        </div>
      )}

      <div className="flex flex-col gap-3 mb-8">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b border-zinc-100 pb-3"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-zinc-500">
                {item.quantity} عدد &middot; {item.price.toLocaleString()} تومان
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">جمع خرید</span>
          <span>{order.subtotal.toLocaleString()} تومان</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-zinc-500">تخفیف</span>
            <span>-{order.discount.toLocaleString()} تومان</span>
          </div>
        )}
        {order.shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-zinc-500">هزینه ارسال</span>
            <span>{order.shipping.toLocaleString()} تومان</span>
          </div>
        )}
        <hr className="border-zinc-200" />
        <div className="flex justify-between font-semibold">
          <span>جمع کل</span>
          <span>{order.total.toLocaleString()} تومان</span>
        </div>
      </div>
    </div>
  );
}
