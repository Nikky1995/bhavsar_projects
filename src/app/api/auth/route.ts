import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  createAdminSessionValue,
  isAdminAuthenticated,
} from "@/lib/auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = createAdminSessionValue();

  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return NextResponse.json({ authenticated: false });
}
