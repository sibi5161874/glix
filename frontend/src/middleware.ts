import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isSuperadmin = pathname.startsWith("/superadmin") && pathname !== "/superadmin/login";
  const isApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/employees") ||
    pathname.startsWith("/leaves") ||
    pathname.startsWith("/holidays");

  if (!req.auth && (isApp || isSuperadmin)) {
    const loginPath = isSuperadmin ? "/superadmin/login" : "/login";
    return NextResponse.redirect(new URL(loginPath, req.nextUrl.origin));
  }

  if (isSuperadmin && req.auth && !req.auth.user.isPlatformAdmin) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employees/:path*",
    "/leaves/:path*",
    "/holidays/:path*",
    "/superadmin/:path*",
  ],
};
