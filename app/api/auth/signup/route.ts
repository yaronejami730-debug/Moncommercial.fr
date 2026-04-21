import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, setSession } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }
  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email.' },
        { status: 409 }
      );
    }

    const [created] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        name,
        passwordHash: hashPassword(password),
      })
      .returning({ id: users.id });

    await setSession(created.id);

    return NextResponse.json({ ok: true, redirect: '/onboarding' });
  } catch (err) {
    console.error('[signup] failed:', err);
    return NextResponse.json(
      { error: 'Erreur serveur. Vérifiez la configuration (DATABASE_URL, SESSION_SECRET).' },
      { status: 500 }
    );
  }
}
