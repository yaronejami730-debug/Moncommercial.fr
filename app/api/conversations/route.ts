import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { requireSubscription } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings, users } from '@/lib/db/schema';
import { getOrCreateConversation } from '@/lib/conversations';

const bodySchema = z.object({
  recipientId: z.string().uuid(),
  listingId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  let me;
  try {
    me = await requireSubscription();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    const status = msg === 'Active subscription required' ? 402 : 401;
    return NextResponse.json({ error: msg }, { status });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  if (parsed.data.recipientId === me.id) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
  }

  const recipient = await db.query.users.findFirst({
    where: eq(users.id, parsed.data.recipientId),
  });
  if (!recipient) return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });

  let listingId: string | null = null;
  if (parsed.data.listingId) {
    const l = await db.query.listings.findFirst({
      where: eq(listings.id, parsed.data.listingId),
    });
    if (l) listingId = l.id;
  }

  const conv = await getOrCreateConversation(me.id, recipient.id, listingId);
  return NextResponse.json({ conversation: conv }, { status: 201 });
}
