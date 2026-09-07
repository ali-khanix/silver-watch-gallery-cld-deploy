import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl">
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/admin" className="text-sm font-bold">
            پنل مدیریت
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm underline">
              محصولات
            </Link>
            <Link href="/admin/orders" className="text-sm underline">
              سفارش ها
            </Link>
            <Link href="/admin/users" className="text-sm underline">
              کاربران
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
