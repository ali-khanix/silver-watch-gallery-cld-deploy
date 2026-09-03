"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const { refresh } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "خطایی رخ داد");
      return;
    }
    setStep("otp");
  };

  const verifyOtp = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "خطایی رخ داد");
      return;
    }

    await refresh();
    router.push("/");
  };

  return (
    <div dir="rtl" className="max-w-sm mx-auto py-16 px-4">
      <h1 className="text-xl font-bold mb-6 text-center">
        ورود به حساب کاربری
      </h1>

      {step === "phone" ? (
        <div className="flex flex-col gap-4">
          <input
            type="tel"
            placeholder="09xxxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-lg px-4 py-2 text-right"
            dir="ltr"
          />
          <Button onClick={sendOtp} disabled={loading || !phone}>
            {loading ? "در حال ارسال..." : "دریافت کد تایید"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-500 text-center">
            کد ارسال شده به {phone} را وارد کنید
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="کد ۶ رقمی"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border rounded-lg px-4 py-2 text-center tracking-widest"
            dir="ltr"
          />
          <Button onClick={verifyOtp} disabled={loading || code.length < 4}>
            {loading ? "در حال بررسی..." : "تایید و ورود"}
          </Button>
          <button
            onClick={() => setStep("phone")}
            className="text-xs text-zinc-400 underline"
          >
            اصلاح شماره موبایل
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
