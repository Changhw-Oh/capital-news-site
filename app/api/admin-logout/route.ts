import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "../../../lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 0,
  });

  return response;
}