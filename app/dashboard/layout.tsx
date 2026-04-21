import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import DashboardShell from './shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/sign-in');
  if (!user.onboardingCompleted || !user.role) redirect('/onboarding');

  const requiresSubscription = user.role !== 'commercial';
  let isSubscribed = !requiresSubscription;
  if (requiresSubscription) {
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, user.id),
    });
    isSubscribed = !!sub && (sub.status === 'active' || sub.status === 'trialing');
  }

  return (
    <DashboardShell
      role={user.role}
      userName={user.name}
      userEmail={user.email}
      userAvatar={user.avatarUrl ?? null}
      subscriptionState={{ requiresSubscription, isSubscribed }}
    >
      {children}
    </DashboardShell>
  );
}
