import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPrefixes = ["/dashboard", "/profile", "/settings"];

function isProtectedPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en|de)/, "") || "/";
  return protectedPrefixes.some(
    (prefix) => withoutLocale === prefix || withoutLocale.startsWith(`${prefix}/`)
  );
}

function isAuthPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en|de)/, "") || "/";
  return [
    "/sign-in",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/email-verified",
  ].some((p) => withoutLocale === p || withoutLocale.startsWith(p));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const response = intlMiddleware(request);
  const token = request.cookies.get("resumeai-token")?.value;
  const isAuthenticated = Boolean(token);

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const locale = pathname.startsWith("/de") ? "de" : "en";
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPath(pathname) && isAuthenticated) {
    const locale = pathname.startsWith("/de") ? "de" : "en";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
