import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { setSession, verifyPassword } from '@/lib/auth';

const schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !user.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json(
      { error: 'Email ou mot de passe incorrect.' },
      { status: 401 }
    );
  }

  await setSession(user.id);

  const redirect =
    user.onboardingCompleted && user.role ? '/dashboard' : '/onboarding';
  return NextResponse.json({ ok: true, redirect });
}
