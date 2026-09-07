import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/order-status";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  delivered: "bg-blue-100 text-blue-700",
  returned: "bg-orange-100 text-orange-700",
  refused: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div dir="rtl" className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-6">سفارش ها ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="text-zinc-500 text-sm">هنوز سفارشی ثبت نشده</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="border rounded-xl p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{order.name}</p>
                <p className="text-xs text-zinc-500">
                  {order.phone} &middot; {order.items.length} کالا &middot;{" "}
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    STATUS_STYLES[order.status as OrderStatus] ??
                    "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status as OrderStatus] ??
                    order.status}
                </span>
                <span className="text-sm font-semibold">
                  {order.total.toLocaleString()} تومان
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
