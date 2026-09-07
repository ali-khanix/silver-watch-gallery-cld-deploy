"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const AdminBroadcastForm = () => {
  const [messageText, setMessageText] = useState("");
  const [sendAt, setSendAt] = useState(""); // datetime-local value, optional
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const confirmed = window.confirm(
      sendAt
        ? "ارسال زمانبندی شده برای همه کاربران ثبت شود؟"
        : "این پیامک همین الان برای همه کاربران ثبت‌نام شده ارسال می‌شود. مطمئنید؟"
    );
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageText,
        sendAt: sendAt || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "خطا در ارسال پیامک");
      return;
    }

    toast.success(
      data.scheduled
        ? `ارسال به ${data.sentTo} کاربر زمانبندی شد`
        : `پیامک برای ${data.sentTo} کاربر ارسال شد`
    );
    setMessageText("");
    setSendAt("");
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="متن پیامک تبلیغاتی..."
        rows={4}
        className="border rounded-lg p-3 text-sm resize-none"
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-500">زمانبندی (اختیاری):</label>
        <input
          type="datetime-local"
          value={sendAt}
          onChange={(e) => setSendAt(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <Button
          onClick={handleSend}
          disabled={loading || !messageText.trim()}
          className="disabled:opacity-50"
        >
          {loading ? "در حال ارسال..." : "ارسال به همه کاربران"}
        </Button>
      </div>
    </div>
  );
};

export default AdminBroadcastForm;
