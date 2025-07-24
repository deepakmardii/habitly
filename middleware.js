import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const { pathname } = request.nextUrl;

  if (pathname === '/dashboard' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname === '/' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard'],
}; 