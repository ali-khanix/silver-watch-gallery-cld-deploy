const SMS_IR_BASE = "https://api.sms.ir/v1";

export async function sendOtpSms(mobile: string, code: string) {
  const res = await fetch(`${SMS_IR_BASE}/send/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-KEY": process.env.SMS_IR_API_KEY!,
    },
    body: JSON.stringify({
      mobile,
      templateId: Number(process.env.SMS_IR_OTP_TEMPLATE_ID),
      parameters: [{ name: "CODE", value: code }],
    }),
  });

  const data = await res.json();

  if (data.status !== 1) {
    throw new Error(data.message || "ارسال پیامک ناموفق بود");
  }

  return data.data as { messageId: number; cost: number };
}
