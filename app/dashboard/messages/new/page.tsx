import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings, users } from '@/lib/db/schema';
import { getOrCreateConversation } from '@/lib/conversations';

export default async function NewConversationPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; listing?: string }>;
}) {
  const { to, listing } = await searchParams;
  const me = await requireOnboarded();

  if (!to || to === me.id) redirect('/dashboard/search');

  const other = await db.query.users.findFirst({ where: eq(users.id, to) });
  if (!other) redirect('/dashboard/search');

  let listingId: string | null = null;
  if (listing) {
    const l = await db.query.listings.findFirst({ where: eq(listings.id, listing) });
    if (l) listingId = l.id;
  }

  const conv = await getOrCreateConversation(me.id, other.id, listingId);
  redirect(`/dashboard/messages/${conv.id}`);
}
