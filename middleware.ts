import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "capital_news_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (!isAdminPage || isLoginPage) {
    return NextResponse.next();
  }

  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (adminCookie === "logged_in") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};