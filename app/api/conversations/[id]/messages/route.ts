import { NextResponse } from 'next/server';
import { z } from 'zod';
import { asc, eq } from 'drizzle-orm';
import { requireOnboarded, requireSubscription } from '@/lib/auth';
import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/db/schema';
import { isParticipant } from '@/lib/conversations';

const bodySchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const me = await requireOnboarded();
    const { id } = await params;

    const conv = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
    });
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!isParticipant(conv, me.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const thread = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({ messages: thread });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let me;
  try {
    me = await requireSubscription();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    const status = msg === 'Active subscription required' ? 402 : 401;
    return NextResponse.json({ error: msg }, { status });
  }

  const { id } = await params;

  const conv = await db.query.conversations.findFirst({
    where: eq(conversations.id, id),
  });
  if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!isParticipant(conv, me.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const [created] = await db
    .insert(messages)
    .values({
      conversationId: id,
      senderId: me.id,
      content: parsed.data.content,
    })
    .returning();

  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, id));

  return NextResponse.json({ message: created }, { status: 201 });
}
