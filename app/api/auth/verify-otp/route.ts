import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashOtp } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: Request) {
  const { phone: rawPhone, code } = await req.json();
  const phone = normalizePhone(rawPhone);

  if (!phone || !code) {
    return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
  }

  const otp = await prisma.otpCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  if (!otp || otp.expiresAt < new Date()) {
    return NextResponse.json({ error: "کد منقضی شده است" }, { status: 400 });
  }
  if (otp.attempts >= 5) {
    return NextResponse.json(
      { error: "تعداد تلاش‌ها بیش از حد مجاز است" },
      { status: 429 }
    );
  }
  if (otp.codeHash !== hashOtp(code)) {
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json(
      { error: "کد وارد شده نادرست است" },
      { status: 400 }
    );
  }

  await prisma.otpCode.delete({ where: { id: otp.id } });

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    },
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
