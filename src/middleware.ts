import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

import { AFTER_LOGIN_URL, isAuthPath, isPublicPath } from '@/config';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = getSessionCookie(req);

  // If user is already logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL(AFTER_LOGIN_URL, req.url));
  }

  // Allow access to public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  // If user is not logged in and trying to access a protected route, redirect to login with callback url
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  return NextResponse.next();
}

// Match all routes except for static files and Next.js internal routes
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
