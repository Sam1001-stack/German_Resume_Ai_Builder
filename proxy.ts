import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { getLocaleFromPathname, stripLocalePrefix } from "@/lib/locale-utils";

const intlMiddleware = createMiddleware(routing);

const protectedPrefixes = ["/dashboard", "/profile", "/settings"];

function isProtectedPath(pathname: string): boolean {
  const withoutLocale = stripLocalePrefix(pathname);
  return protectedPrefixes.some(
    (prefix) => withoutLocale === prefix || withoutLocale.startsWith(`${prefix}/`)
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const response = intlMiddleware(request);
  const token = request.cookies.get("resumeai-token")?.value;
  const isAuthenticated = Boolean(token);

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const locale = getLocaleFromPathname(pathname);
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
