import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminPassword } from "../../../lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password || "";

    if (!isValidAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 틀렸어요." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_COOKIE_NAME, "logged_in", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "로그인 처리 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}