import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Check if the path (without locale prefix) is a dashboard route
  const pathnameWithoutLocale = routing.locales.reduce(
    (path, locale) => path.replace(`/${locale}`, ""),
    pathname
  );

  if (pathnameWithoutLocale.startsWith("/dashboard") && !req.auth) {
    const firstSegment = pathname.split("/")[1];
    const locale = routing.locales.includes(firstSegment as "ru" | "kk")
      ? firstSegment
      : routing.defaultLocale;
    const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
