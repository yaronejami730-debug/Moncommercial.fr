import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';

export async function POST() {
  let me;
  try {
    me = await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, me.id),
  });

  if (!sub?.stripeSubscriptionId) {
    return NextResponse.json({ error: 'Aucun abonnement à annuler' }, { status: 404 });
  }

  if (sub.status === 'canceled') {
    return NextResponse.json({ ok: true, alreadyCanceled: true });
  }

  try {
    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
  } catch (err) {
    console.error('Stripe cancel error', err);
    return NextResponse.json({ error: 'Erreur Stripe' }, { status: 500 });
  }

  await db
    .update(subscriptions)
    .set({ status: 'canceled', updatedAt: new Date() })
    .where(eq(subscriptions.id, sub.id));

  return NextResponse.json({ ok: true });
}
