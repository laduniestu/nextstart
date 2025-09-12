import { env } from './env/client';

export const APP_CONFIG: { mode: 'coming-soon' | 'maintenance' | 'live' } = {
  mode: 'live',
};
export const DATABASE_PREFIX = 'shadcn';
export const LOGIN_URL = '/auth/login';
export const AFTER_LOGIN_URL = '/app';
export const APP_NAME = env.NEXT_PUBLIC_APP_NAME || 'Next Start';
export const APP_URL = env.NEXT_PUBLIC_APP_URL;
export const APP_EMAIL =
  'no-reply@' + (APP_URL?.split('://')[1] || 'example.com');

export const publicPathsConfig = {
  // Exact paths that should be publicly accessible
  exactPaths: ['/'],

  // Exact paths for authentication
  authPaths: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/verify-email',
    '/auth/reset-password',
  ],

  // Path prefixes - any path starting with these will be public
  prefixes: ['/docs/', '/api/auth/'],
};

export function isAuthPath(pathname: string): boolean {
  // Check prefix matches
  for (const prefixAuth of publicPathsConfig.authPaths) {
    if (pathname.startsWith(prefixAuth)) {
      return true;
    }
  }

  return false;
}

export function isPublicPath(pathname: string): boolean {
  // Check exact path matches
  if (publicPathsConfig.exactPaths.includes(pathname)) {
    return true;
  }

  // Check prefix matches
  for (const prefix of publicPathsConfig.prefixes) {
    if (pathname.startsWith(prefix)) {
      return true;
    }
  }

  // Check prefix matches
  for (const prefixAuth of publicPathsConfig.authPaths) {
    if (pathname.startsWith(prefixAuth)) {
      return true;
    }
  }

  return false;
}
