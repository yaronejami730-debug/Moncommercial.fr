import { cookies } from 'next/headers';
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './db/schema';

const SESSION_COOKIE = 'mc_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 jours

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return timingSafeEqual(derived, keyBuf);
}

function sign(value: string): string {
  return createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

export function encodeSession(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export function decodeSession(token: string | undefined): string | null {
  if (!token) return null;
  const [userId, sig] = token.split('.');
  if (!userId || !sig) return null;
  const expected = sign(userId);
  if (sig.length !== expected.length) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (!timingSafeEqual(a, b)) return null;
  return userId;
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return decodeSession(token);
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  return user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireOnboarded() {
  const user = await requireAuth();
  if (!user.onboardingCompleted || !user.role) {
    throw new Error('Onboarding required');
  }
  return user;
}

export async function requireSubscription() {
  const user = await requireOnboarded();
  if (user.role === 'commercial') return user;

  const subscription = await db.query.subscriptions.findFirst({
    where: (subs, { eq }) => eq(subs.userId, user.id),
  });

  if (!subscription || subscription.status !== 'active') {
    throw new Error('Active subscription required');
  }
  return user;
}
