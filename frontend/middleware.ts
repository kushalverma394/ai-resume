import { NextResponse, type NextRequest } from "next/server";

import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

const protectedRoutes = ["/dashboard", "/upload", "/analysis", "/history", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload", "/analysis", "/history", "/profile", "/login", "/signup"],
};