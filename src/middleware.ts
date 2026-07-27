import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Sécurité : /fr/admin/* ou /en/admin/* -> /admin/* (le backoffice n'a pas de préfixe de langue)
  const localeAdminMatch = pathname.match(/^\/(fr|en)(\/admin(?:\/.*)?)$/);
  if (localeAdminMatch) {
    const cleanPath = localeAdminMatch[2];
    return NextResponse.redirect(new URL(cleanPath, req.nextUrl.origin));
  }

  const isLoggedIn = !!req.auth;

  // Le backoffice vit hors du routing next-intl (pas de préfixe /fr ou /en)
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (!isLoggedIn && !isLoginPage) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  // Reste du site : routing next-intl
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};