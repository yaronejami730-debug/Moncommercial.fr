'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { SubscriptionProvider } from './subscription-context';

const ROLE_LABEL: Record<UserRole, string> = {
  commercial: 'Commercial',
  regisseur: 'Régie',
  installateur: 'Installateur',
};

export default function DashboardShell({
  role,
  userName,
  userEmail,
  userAvatar,
  subscriptionState,
  children,
}: {
  role: UserRole;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  subscriptionState: { requiresSubscription: boolean; isSubscribed: boolean };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Accueil', icon: 'dashboard' },
    { href: '/dashboard/search', label: 'Recherche', icon: 'search' },
    { href: '/dashboard/listings', label: 'Annonces', icon: 'list_alt' },
    { href: '/dashboard/messages', label: 'Messages', icon: 'chat' },
    { href: '/dashboard/subscription', label: 'Abonnement', icon: 'workspace_premium' },
    { href: '/dashboard/profile', label: 'Profil', icon: 'person' },
  ];

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const needsUpgrade =
    subscriptionState.requiresSubscription && !subscriptionState.isSubscribed;

  return (
    <SubscriptionProvider state={subscriptionState}>
      <div className="flex h-screen bg-paper-tint">
        <aside className="w-64 bg-white border-r border-line flex flex-col">
          <div className="p-6 border-b border-line">
            <Link href="/dashboard" className="flex flex-col gap-1">
              <Image
                src="/logo.png"
                alt="Centrale de l'Énergie"
                width={1092}
                height={190}
                priority
                className="h-10 w-auto"
              />
              <p className="text-[11px] text-ink-muted font-semibold">{ROLE_LABEL[role]}</p>
            </Link>
          </div>

          <nav className="space-y-1 px-3 py-4 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const showBadge =
                item.href === '/dashboard/subscription' && needsUpgrade;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-semibold ${
                    active
                      ? 'bg-brand-soft text-brand'
                      : 'text-ink-soft hover:bg-paper-tint hover:text-ink'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {showBadge && (
                    <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0" aria-label="Abonnement requis" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-line">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center overflow-hidden flex-shrink-0">
                {userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-brand text-base">person</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink truncate">{userName}</div>
                <div className="text-xs text-ink-muted truncate">{userEmail}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-1 w-full text-left text-sm text-ink-soft hover:bg-paper-tint hover:text-ink rounded-lg px-3 py-2 flex items-center gap-2 font-semibold"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Se déconnecter
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </SubscriptionProvider>
  );
}
