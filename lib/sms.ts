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

// Sends ONE message to a batch of up to 100 numbers (sms.ir's hard limit).
export async function sendBulkSms(
  mobiles: string[],
  messageText: string,
  lineNumber: number,
  sendDateTime: number | null = null
) {
  const res = await fetch(`${SMS_IR_BASE}/send/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-KEY": process.env.SMS_IR_API_KEY!,
    },
    body: JSON.stringify({
      lineNumber,
      messageText,
      mobiles,
      sendDateTime,
    }),
  });

  const data = await res.json();

  if (data.status !== 1) {
    throw new Error(data.message || "ارسال پیامک گروهی ناموفق بود");
  }

  return data.data as {
    packId: string;
    messageIds: number[];
    cost: number;
  };
}

// Cancels a scheduled send (must be more than 3 minutes before send time).
export async function cancelScheduledSms(packId: string) {
  const res = await fetch(`${SMS_IR_BASE}/send/scheduled/${packId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-API-KEY": process.env.SMS_IR_API_KEY!,
    },
  });

  const data = await res.json();

  if (data.status !== 1) {
    throw new Error(data.message || "لغو ارسال زمانبندی شده ناموفق بود");
  }

  return data.data as { returnedCreditCount: number; smsCount: number };
}
