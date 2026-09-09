import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import AdminOrderActions from "@/components/AdminOrderActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-1">جزئیات سفارش</h1>
      <AdminOrderActions orderId={order.id} currentStatus={order.status} />
      <p className="text-zinc-500 text-sm mb-8">شماره: {order.id}</p>

      <div className="bg-zinc-100 rounded-xl p-4 mb-6">
        <h2 className="font-medium mb-3">اطلاعات مشتری</h2>
        <div className="flex flex-col gap-1 text-sm">
          <p>
            <span className="text-zinc-500">نام:</span> {order.name}
          </p>
          <p>
            <span className="text-zinc-500">ایمیل:</span> {order.email}
          </p>
          <p>
            <span className="text-zinc-500">تلفن:</span> {order.phone}
          </p>
          <p>
            <span className="text-zinc-500">شهر:</span> {order.city}
          </p>
          <p>
            <span className="text-zinc-500">کد پستی:</span> {order.postalCode}
          </p>
          <p>
            <span className="text-zinc-500">آدرس:</span> {order.address}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
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
                رنگ: {item.color} &middot; {item.quantity} عدد &middot;{" "}
                {item.price.toLocaleString()} تومان
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
        <div className="flex justify-between">
          <span className="text-zinc-500">تخفیف</span>
          <span>{order.discount.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">هزینه ارسال</span>
          <span>{order.shipping.toLocaleString()} تومان</span>
        </div>
        <hr className="border-zinc-200" />
        <div className="flex justify-between font-semibold">
          <span>جمع کل</span>
          <span>{order.total.toLocaleString()} تومان</span>
        </div>
      </div>
    </div>
  );
}
