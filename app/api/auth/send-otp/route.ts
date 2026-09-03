import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpSms } from "@/lib/sms";
import { normalizePhone } from "@/lib/phone";

export async function POST(req: Request) {
  const { phone: rawPhone } = await req.json();
  const phone = normalizePhone(rawPhone);

  if (!phone) {
    return NextResponse.json(
      { error: "شماره موبایل معتبر نیست" },
      { status: 400 }
    );
  }

  const recent = await prisma.otpCode.findFirst({
    where: { phone, createdAt: { gt: new Date(Date.now() - 60_000) } },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return NextResponse.json(
      { error: "لطفاً کمی صبر کنید و دوباره تلاش کنید" },
      { status: 429 }
    );
  }

  const code = generateOtp();

  await prisma.otpCode.create({
    data: {
      phone,
      codeHash: hashOtp(code),
      expiresAt: new Date(Date.now() + 2 * 60_000),
    },
  });

  try {
    await sendOtpSms(phone, code);
  } catch {
    return NextResponse.json(
      { error: "ارسال پیامک ناموفق بود" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
