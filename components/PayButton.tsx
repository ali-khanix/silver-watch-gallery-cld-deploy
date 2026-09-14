"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

type Props = {
  orderId: string;
};

const PayButton = ({ orderId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error || "خطا در اتصال به درگاه پرداخت");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("خطا در اتصال به درگاه پرداخت");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="w-full disabled:opacity-50"
    >
      {loading ? "در حال اتصال به درگاه..." : "پرداخت با بیت‌پی"}
    </Button>
  );
};

export default PayButton;
