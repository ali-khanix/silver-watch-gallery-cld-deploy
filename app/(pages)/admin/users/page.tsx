import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { ORDER_STATUS_GROUPS } from "@/lib/order-status";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: { select: { status: true } } },
  });

  const countIn = (statuses: string[], orders: { status: string }[]) =>
    orders.filter((o) => statuses.includes(o.status)).length;

  return (
    <div dir="rtl" className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-6">کاربران ({users.length})</h1>

      {users.length === 0 ? (
        <p className="text-zinc-500 text-sm">هنوز کاربری ثبت نام نکرده</p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-xl p-4 flex flex-wrap justify-between items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {user.name ?? (
                      <span className="text-zinc-400">نام تایید نشده</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500" dir="ltr">
                    {user.phone} &middot;{" "}
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  {countIn(ORDER_STATUS_GROUPS.inProgress, user.orders)} در حال انجام
                </span>
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {countIn(ORDER_STATUS_GROUPS.delivered, user.orders)} تحویل شده
                </span>
                <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                  {countIn(ORDER_STATUS_GROUPS.returned, user.orders)} مرجوع شده
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
