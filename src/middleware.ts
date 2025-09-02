import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

import { AFTER_LOGIN_URL, isAuthPath, isPublicPath } from '@/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication status for all routes
  const sessionCookie = getSessionCookie(request);

  // If user is already logged in and trying to access auth pages, redirect to dashboard
  if (sessionCookie && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL(AFTER_LOGIN_URL, request.url));
  }

  // Allow access to public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // For protected paths, check authentication
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Match all routes except for static files and Next.js internal routes
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
