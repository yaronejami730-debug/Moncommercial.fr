import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';

export default async function DashboardPage() {
  const user = await requireOnboarded();

  const requiresSubscription = user.role !== 'commercial';
  const sub = requiresSubscription
    ? await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, user.id),
      })
    : null;
  const isSubscribed =
    !requiresSubscription ||
    (!!sub && (sub.status === 'active' || sub.status === 'trialing'));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-3xl md:text-4xl text-ink">
          Bienvenue, <span className="text-brand">{user.name}</span>
        </h1>
        <p className="text-ink-soft mt-2 text-lg">
          Gérez vos annonces, messages et recherches en un seul endroit.
        </p>
      </div>

      <SubscriptionBanner
        requiresSubscription={requiresSubscription}
        isSubscribed={isSubscribed}
      />

      <div className="grid md:grid-cols-3 gap-5">
        <Card
          icon="list_alt"
          title="Annonces"
          description="Gérez vos offres et projets"
          href="/dashboard/listings"
          cta="Voir les annonces"
        />
        <Card
          icon="chat"
          title="Messages"
          description="Conversations avec vos contacts"
          href="/dashboard/messages"
          cta="Voir les messages"
        />
        <Card
          icon="search"
          title="Recherche"
          description="Trouvez des contacts"
          href="/dashboard/search"
          cta="Commencer la recherche"
        />
      </div>
    </div>
  );
}

function SubscriptionBanner({
  requiresSubscription,
  isSubscribed,
}: {
  requiresSubscription: boolean;
  isSubscribed: boolean;
}) {
  if (!requiresSubscription) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-line p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-verify/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-verify text-2xl">verified</span>
        </div>
        <div className="flex-1">
          <p className="display text-base text-ink">Plan Commercial — gratuit</p>
          <p className="text-ink-soft text-sm">
            Vous accédez à toutes les fonctionnalités sans frais.
          </p>
        </div>
        <Link
          href="/dashboard/subscription"
          className="text-brand font-bold text-sm inline-flex items-center gap-1"
        >
          Détails
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-line p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-verify/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-verify text-2xl">workspace_premium</span>
        </div>
        <div className="flex-1">
          <p className="display text-base text-ink">Abonnement actif</p>
          <p className="text-ink-soft text-sm">
            Toutes les fonctionnalités sont débloquées.
          </p>
        </div>
        <Link
          href="/dashboard/subscription"
          className="text-brand font-bold text-sm inline-flex items-center gap-1"
        >
          Gérer
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-soft rounded-2xl border-2 border-brand p-5 flex items-center gap-4 flex-wrap">
      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-brand text-2xl">workspace_premium</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="display text-base text-ink">Abonnement requis</p>
        <p className="text-ink-soft text-sm">
          Abonnez-vous à 9,99 € / mois pour publier des annonces et envoyer des messages.
        </p>
      </div>
      <Link
        href="/dashboard/subscription"
        className="px-5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors"
      >
        S&apos;abonner
      </Link>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow border border-line p-6 block group"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-2xl text-brand">{icon}</span>
      </div>
      <h2 className="display text-lg text-ink mb-1">{title}</h2>
      <p className="text-ink-soft mb-4 text-sm">{description}</p>
      <span className="text-brand font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        {cta}
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </span>
    </Link>
  );
}
