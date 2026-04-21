import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
  }

  const headerList = await headers();
  const signature = headerList.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error('Stripe signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const subId = session.subscription as string | null;
        const customerId = session.customer as string | null;
        if (userId && subId && customerId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(userId, sub, customerId);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        const customerId = sub.customer as string;
        if (userId) await upsertSubscription(userId, sub, customerId);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handler error', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(
  userId: string,
  sub: Stripe.Subscription,
  customerId: string
) {
  const status = mapStatus(sub.status);
  const firstItem = sub.items.data[0];
  const periodStart = firstItem?.current_period_start
    ? new Date(firstItem.current_period_start * 1000)
    : null;
  const periodEnd = firstItem?.current_period_end
    ? new Date(firstItem.current_period_end * 1000)
    : null;

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (existing) {
    await db
      .update(subscriptions)
      .set({
        status,
        stripeCustomerId: customerId,
        stripeSubscriptionId: sub.id,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existing.id));
  } else {
    await db.insert(subscriptions).values({
      userId,
      status,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    });
  }
}

function mapStatus(
  s: Stripe.Subscription.Status
): 'active' | 'canceled' | 'past_due' | 'trialing' {
  if (s === 'active') return 'active';
  if (s === 'trialing') return 'trialing';
  if (s === 'past_due' || s === 'unpaid') return 'past_due';
  return 'canceled';
}
