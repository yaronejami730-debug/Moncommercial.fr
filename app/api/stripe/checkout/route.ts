import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { stripe, priceIdForRole } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions, users } from '@/lib/db/schema';

const schema = z.object({
  role: z.enum(['regisseur', 'installateur']),
});

export async function POST(req: Request) {
  let me;
  try {
    me = await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const priceId = priceIdForRole(parsed.data.role);
  if (!priceId) {
    return NextResponse.json(
      { error: 'Stripe price not configured for this role' },
      { status: 500 }
    );
  }

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, me.id),
  });

  let customerId = existing?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: me.email,
      name: me.name,
      metadata: { userId: me.id },
    });
    customerId = customer.id;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: me.id,
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancel`,
    subscription_data: {
      metadata: { userId: me.id, role: parsed.data.role },
    },
  });

  // Ensure role is set (if user went through checkout before onboarding)
  await db
    .update(users)
    .set({ role: parsed.data.role })
    .where(eq(users.id, me.id));

  return NextResponse.json({ url: session.url });
}
