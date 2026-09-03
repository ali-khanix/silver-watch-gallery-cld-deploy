import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (token) await prisma.session.deleteMany({ where: { token } });

  const res = NextResponse.json({ success: true });
  res.cookies.delete("session_token");
  return res;
}
