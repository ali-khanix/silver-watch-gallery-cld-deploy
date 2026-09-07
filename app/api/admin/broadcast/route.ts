import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendBulkSms } from "@/lib/sms";

const CHUNK_SIZE = 100; // sms.ir's hard limit per request

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { messageText, sendAt } = await req.json();

  if (!messageText?.trim()) {
    return NextResponse.json({ error: "متن پیامک خالی است" }, { status: 400 });
  }

  // sendAt is an optional ISO string from a <input type="datetime-local">.
  // sms.ir wants a Unix timestamp (seconds), or null for "send now".
  let sendDateTime: number | null = null;
  if (sendAt) {
    const ts = Math.floor(new Date(sendAt).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    if (ts < now + 60 * 60) {
      return NextResponse.json(
        { error: "زمان ارسال باید حداقل یک ساعت بعد از الان باشد" },
        { status: 400 }
      );
    }
    sendDateTime = ts;
  }

  const users = await prisma.user.findMany({ select: { phone: true } });
  const mobiles = users.map((u) => u.phone);

  if (mobiles.length === 0) {
    return NextResponse.json(
      { error: "هیچ کاربری ثبت نام نکرده" },
      { status: 400 }
    );
  }

  const lineNumber = Number(process.env.SMS_IR_LINE_NUMBER);
  const results = [];

  try {
    for (let i = 0; i < mobiles.length; i += CHUNK_SIZE) {
      const chunk = mobiles.slice(i, i + CHUNK_SIZE);
      const result = await sendBulkSms(
        chunk,
        messageText,
        lineNumber,
        sendDateTime
      );
      results.push(result);
    }
  } catch (err) {
    console.error("Broadcast SMS failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطا در ارسال پیامک" },
      { status: 500 }
    );
  }

  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);

  return NextResponse.json({
    sentTo: mobiles.length,
    scheduled: sendDateTime !== null,
    totalCost,
    packIds: results.map((r) => r.packId),
  });
}
