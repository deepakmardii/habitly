import { NextResponse } from "next/server";

export function middleware(request) {
  // Check for NextAuth session cookie (works for both dev and prod)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  
  const { pathname } = request.nextUrl;

  // Protect dashboard route - redirect to home if not authenticated
  if (pathname === "/dashboard" && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Allow authenticated users to access the landing page (they can log out from there)
  // Only redirect to dashboard for other protected routes
  if (pathname.startsWith("/habits") && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (pathname.startsWith("/analytics") && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (pathname.startsWith("/settings") && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (pathname.startsWith("/reminders") && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/habits/:path*", "/analytics/:path*", "/settings/:path*", "/reminders/:path*"],
};
