import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings } from '@/lib/db/schema';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOnboarded();
    const { id } = await params;
    const row = await db.query.listings.findFirst({ where: eq(listings.id, id) });
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ listing: row });
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireOnboarded();
    const { id } = await params;
    const result = await db
      .delete(listings)
      .where(and(eq(listings.id, id), eq(listings.userId, me.id)))
      .returning({ id: listings.id });
    if (result.length === 0) {
      return NextResponse.json({ error: 'Not found or not owner' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
