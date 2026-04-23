import { decodeSession } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/',
  '/pricing',
];

export default async function proxy(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return null;
  }

  // Check for session cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) cookies[name] = decodeURIComponent(value);
  });

  const sessionCookie = cookies['mc_session'];
  const userId = decodeSession(sessionCookie);

  if (!userId) {
    // Redirect to sign-in if not authenticated
    return new Response(null, {
      status: 307,
      headers: {
        Location: '/auth/sign-in',
      },
    });
  }

  return null;
}
