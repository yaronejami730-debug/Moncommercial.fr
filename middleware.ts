import { NextRequest, NextResponse } from 'next/server';
import { decodeSession } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/',
  '/pricing',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('mc_session')?.value;
  const userId = decodeSession(sessionCookie);

  if (!userId) {
    // Redirect to sign-in if not authenticated
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
