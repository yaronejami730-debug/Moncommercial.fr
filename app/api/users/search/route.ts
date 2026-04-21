import { NextResponse } from 'next/server';
import { and, desc, eq, ilike, ne, sql, SQL } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import type { UserRole } from '@/lib/types';

const ROLES: UserRole[] = ['commercial', 'regisseur', 'installateur'];

export async function GET(req: Request) {
  try {
    const me = await requireOnboarded();
    const { searchParams } = new URL(req.url);

    const roleParam = searchParams.get('role');
    const location = searchParams.get('location')?.trim();
    const specialty = searchParams.get('specialty')?.trim();
    const q = searchParams.get('q')?.trim();

    const filters: SQL[] = [ne(users.id, me.id), eq(users.onboardingCompleted, true)];

    if (roleParam && ROLES.includes(roleParam as UserRole)) {
      filters.push(eq(users.role, roleParam as UserRole));
    }
    if (location) filters.push(ilike(users.location, `%${location}%`));
    if (q) filters.push(ilike(users.name, `%${q}%`));
    if (specialty) {
      filters.push(sql`${users.specialties} @> ${JSON.stringify([specialty])}::jsonb`);
    }

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        location: users.location,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        specialties: users.specialties,
      })
      .from(users)
      .where(and(...filters))
      .orderBy(desc(users.createdAt))
      .limit(50);

    return NextResponse.json({ results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    const status = msg === 'Unauthorized' || msg === 'Onboarding required' ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
