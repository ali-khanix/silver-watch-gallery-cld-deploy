"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AdminUserActions = ({
  userId,
  orderCount,
}: {
  userId: string;
  orderCount: number;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const message =
      orderCount > 0
        ? `این کاربر ${orderCount} سفارش دارد. حذف کاربر، سفارش‌های او را نیز برای همیشه حذف می‌کند. ادامه می‌دهید؟`
        : "حذف این کاربر؟ این عمل غیرقابل بازگشت است";

    if (!window.confirm(message)) return;

    setLoading(true);
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      toast.error("خطا در حذف کاربر");
      return;
    }
    toast.success("کاربر حذف شد");
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm bg-red-100 text-red-600 rounded-lg px-3 py-2 hover:bg-red-200 transition-colors disabled:opacity-50"
    >
      حذف کاربر
    </button>
  );
};

export default AdminUserActions;
