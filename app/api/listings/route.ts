import { NextResponse } from 'next/server';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { requireOnboarded, requireSubscription } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings } from '@/lib/db/schema';

const createSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  category: z.enum(['collaboration', 'rdv', 'project']),
  location: z.string().max(120).optional().or(z.literal('')),
  budget: z.string().max(60).optional().or(z.literal('')),
});

export async function GET(req: Request) {
  try {
    await requireOnboarded();
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get('status') !== 'all';

    const rows = await db
      .select()
      .from(listings)
      .where(onlyActive ? eq(listings.status, 'active') : undefined)
      .orderBy(desc(listings.createdAt))
      .limit(100);

    return NextResponse.json({ listings: rows });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: Request) {
  let me;
  try {
    me = await requireSubscription();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    const status = msg === 'Active subscription required' ? 402 : 401;
    return NextResponse.json({ error: msg }, { status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { title, description, category, location, budget } = parsed.data;

  const [created] = await db
    .insert(listings)
    .values({
      userId: me.id,
      title,
      description,
      category,
      location: location || null,
      budget: budget || null,
    })
    .returning({ id: listings.id });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
