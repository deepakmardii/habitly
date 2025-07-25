import { NextResponse } from "next/server";

// TODO If you want to fully migrate to NextAuth for email/password as well, let me know—otherwise, this hybrid approach will work for now.

export function middleware(request) {
  // Check for NextAuth session cookie (works for both dev and prod)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  // Also check for custom isLoggedIn cookie for email/password login
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard" && !sessionToken && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname === "/" && (sessionToken || isLoggedIn)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
