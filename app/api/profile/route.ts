import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

const schema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional().or(z.literal('')),
  location: z.string().max(120).optional().or(z.literal('')),
  website: z.string().max(200).optional().or(z.literal('')),
  avatarUrl: z.string().max(500).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  specialties: z.array(z.string().max(120)).max(60).default([]),
});

export async function PATCH(req: Request) {
  try {
    const me = await requireOnboarded();
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const d = parsed.data;

    await db
      .update(users)
      .set({
        name: d.name,
        phone: d.phone || null,
        location: d.location || null,
        website: d.website || null,
        avatarUrl: d.avatarUrl || null,
        bio: d.bio || null,
        specialties: d.specialties,
        updatedAt: new Date(),
      })
      .where(eq(users.id, me.id));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
