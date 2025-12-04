import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force Node runtime so we can use jsonwebtoken for verification here.
export const runtime = 'nodejs';

// Protect these route prefixes — if user has no auth cookie or token is invalid, redirect to sign-in
const PROTECTED_MATCHERS = [
  '/dashboard',
  '/tasks',
  '/notifications',
  '/projects',
  '/settings',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run protection for paths we care about
  const shouldProtect = PROTECTED_MATCHERS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!shouldProtect) return NextResponse.next();

  const token = req.cookies.get('authToken')?.value;
  const signInUrl = new URL('/auth/signin', req.url);
  // include original path so we can redirect back after signin
  signInUrl.searchParams.set('from', pathname);

  if (!token) {
    return NextResponse.redirect(signInUrl);
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Token invalid or expired — clear cookie and redirect to signin
    const res = NextResponse.redirect(signInUrl);
    const secureFlag = process.env.NODE_ENV === 'production';
    const cookieValue = `authToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict${secureFlag ? '; Secure' : ''}`;
    res.headers.set('Set-Cookie', cookieValue);
    return res;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/tasks/:path*',
    '/tasks',
    '/notifications/:path*',
    '/notifications',
    '/projects/:path*',
    '/projects',
    '/settings/:path*',
    '/settings',
  ],
};
