import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import EditProfileForm from "@/components/EditProfileForm";
import { getOrderStatusCounts } from "@/lib/order-status";

export default async function UserPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const counts = await getOrderStatusCounts(user.id);

  return (
    <div dir="rtl" className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-zinc-100 rounded-2xl p-6 mb-6">
        <p className="text-sm text-zinc-500 mb-1">
          {user.name ? "نام" : "نام تایید نشده"}
        </p>
        <h1 className="text-xl font-bold">
          {user.name ?? "عزیز"} خوش اومدی!
        </h1>
        <p className="text-sm text-zinc-500 mt-2" dir="ltr">
          {user.phone}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counts.inProgress}</p>
          <p className="text-xs text-zinc-500 mt-1">سفارش در حال انجام</p>
        </div>
        <div className="border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counts.delivered}</p>
          <p className="text-xs text-zinc-500 mt-1">سفارش تحویل شده</p>
        </div>
        <div className="border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counts.returned}</p>
          <p className="text-xs text-zinc-500 mt-1">سفارش مرجوع شده</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">ویرایش پروفایل</h2>
        <EditProfileForm initialName={user.name} initialImage={user.image} />
      </div>

      <Link href="/orders" className="text-sm underline">
        مشاهده همه سفارش ها
      </Link>
    </div>
  );
}
