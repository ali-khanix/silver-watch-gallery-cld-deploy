"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AdminOrderActions = ({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("خطا در بروزرسانی سفارش");
      return;
    }
    toast.success("وضعیت سفارش بروزرسانی شد");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!window.confirm("حذف این سفارش؟ این عمل غیرقابل بازگشت است")) return;
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      toast.error("خطا در حذف سفارش");
      return;
    }
    toast.success("سفارش حذف شد");
    router.push("/admin/orders");
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== "accepted" && (
        <button
          onClick={() => updateStatus("accepted")}
          disabled={loading}
          className="text-sm bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          تایید سفارش
        </button>
      )}
      {currentStatus !== "delivered" && (
        <button
          onClick={() => updateStatus("delivered")}
          disabled={loading}
          className="text-sm bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          تحویل داده شد
        </button>
      )}
      {currentStatus !== "returned" && (
        <button
          onClick={() => updateStatus("returned")}
          disabled={loading}
          className="text-sm bg-orange-100 text-orange-700 rounded-lg px-3 py-2 hover:bg-orange-200 transition-colors disabled:opacity-50"
        >
          مرجوع شد
        </button>
      )}
      {currentStatus !== "refused" && (
        <button
          onClick={() => updateStatus("refused")}
          disabled={loading}
          className="text-sm bg-yellow-100 text-yellow-700 rounded-lg px-3 py-2 hover:bg-yellow-200 transition-colors disabled:opacity-50"
        >
          رد سفارش
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm bg-red-100 text-red-600 rounded-lg px-3 py-2 hover:bg-red-200 transition-colors disabled:opacity-50"
      >
        حذف سفارش
      </button>
    </div>
  );
};

export default AdminOrderActions;
