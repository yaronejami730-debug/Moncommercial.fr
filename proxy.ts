import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSession } from '@/lib/auth';

const SESSION_COOKIE = 'mc_session';

const PUBLIC_PATHS = [
  /^\/$/,
  /^\/pricing(\/.*)?$/,
  /^\/auth\/(sign-in|sign-up)(\/.*)?$/,
  /^\/api\/auth\/(login|signup|logout|me)$/,
  /^\/api\/webhooks(\/.*)?$/,
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const userId = decodeSession(token);

  if (!userId) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
