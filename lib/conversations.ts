import { and, eq, or } from 'drizzle-orm';
import { db } from './db';
import { conversations } from './db/schema';

export function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function getOrCreateConversation(
  userAId: string,
  userBId: string,
  listingId?: string | null
) {
  if (userAId === userBId) throw new Error('Cannot message yourself');
  const [p1, p2] = orderedPair(userAId, userBId);

  const existing = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.participant1Id, p1),
      eq(conversations.participant2Id, p2)
    ),
  });
  if (existing) return existing;

  const [created] = await db
    .insert(conversations)
    .values({
      participant1Id: p1,
      participant2Id: p2,
      listingId: listingId || null,
    })
    .returning();
  return created;
}

export function isParticipant(
  conv: { participant1Id: string; participant2Id: string },
  userId: string
) {
  return conv.participant1Id === userId || conv.participant2Id === userId;
}
