import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

const schema = z.object({
  role: z.enum(['commercial', 'regisseur', 'installateur']),
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional().or(z.literal('')),
  location: z.string().min(1).max(120),
  website: z.string().max(200).optional().or(z.literal('')),
  avatarUrl: z.string().max(500).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  specialties: z.array(z.string().max(120)).max(60).default([]),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { role, name, phone, location, website, avatarUrl, bio, specialties } = parsed.data;

  await db
    .update(users)
    .set({
      role,
      name,
      phone: phone || null,
      location,
      website: website || null,
      avatarUrl: avatarUrl || null,
      bio: bio || null,
      specialties,
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({ ok: true });
}
