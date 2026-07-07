import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

const PUBLIC_FILE_PATTERN = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicFile = PUBLIC_FILE_PATTERN.test(pathname);
  const isNextInternalRoute = pathname.startsWith("/_next");
  const isApiRoute = pathname.startsWith("/api");
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicFile || isNextInternalRoute || isApiRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("mula_auth_token")?.value;

  if (!token && !isAuthRoute) {
    const loginUrl = new URL("/auth/sign-in", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};