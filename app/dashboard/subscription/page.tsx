import { eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import CheckoutButton from '@/app/pricing/checkout-button';
import CancelSubscriptionButton from './cancel-button';

const ROLE_PRICE: Record<string, { name: string; price: string }> = {
  commercial: { name: 'Commercial', price: 'Gratuit' },
  regisseur: { name: 'Régie', price: '9,99 € / mois' },
  installateur: { name: 'Installateur', price: '9,99 € / mois' },
};

function formatDate(d: Date | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  active: { label: 'Actif', cls: 'bg-verify/10 text-verify' },
  trialing: { label: 'Essai', cls: 'bg-verify/10 text-verify' },
  past_due: { label: 'Paiement en retard', cls: 'bg-orange-100 text-orange-700' },
  canceled: { label: 'Annulé', cls: 'bg-red-100 text-red-700' },
};

export default async function SubscriptionPage() {
  const user = await requireOnboarded();
  const plan = ROLE_PRICE[user.role ?? 'commercial'];

  const sub =
    user.role === 'commercial'
      ? null
      : (await db.query.subscriptions.findFirst({
          where: eq(subscriptions.userId, user.id),
        })) ?? null;

  const isActive =
    user.role === 'commercial' ||
    (!!sub && (sub.status === 'active' || sub.status === 'trialing'));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="display text-3xl md:text-4xl text-ink">Abonnement</h1>
        <p className="text-ink-soft mt-2">
          Gérez votre abonnement MonCommercial.fr.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-line p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
              Plan actuel
            </p>
            <h2 className="display text-2xl text-ink mt-1">{plan.name}</h2>
            <p className="text-ink-soft mt-1">{plan.price}</p>
          </div>
          {sub && STATUS_LABEL[sub.status] && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_LABEL[sub.status].cls}`}
            >
              {STATUS_LABEL[sub.status].label}
            </span>
          )}
          {user.role === 'commercial' && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-verify/10 text-verify">
              Gratuit à vie
            </span>
          )}
        </div>

        {sub && (sub.status === 'active' || sub.status === 'trialing') && (
          <div className="mt-5 pt-5 border-t border-line grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ink-muted font-semibold mb-0.5">Période en cours</p>
              <p className="text-ink">
                {formatDate(sub.currentPeriodStart)} → {formatDate(sub.currentPeriodEnd)}
              </p>
            </div>
            <div>
              <p className="text-ink-muted font-semibold mb-0.5">Prochain renouvellement</p>
              <p className="text-ink">{formatDate(sub.currentPeriodEnd)}</p>
            </div>
          </div>
        )}
      </div>

      {user.role !== 'commercial' && !isActive && (
        <div className="bg-brand-soft rounded-2xl border-2 border-brand p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-brand text-2xl">workspace_premium</span>
            <h3 className="display text-xl text-ink">Activez votre abonnement</h3>
          </div>
          <p className="text-ink-soft text-sm mb-4">
            Publiez des annonces et envoyez des messages en souscrivant à l&apos;abonnement
            {' '}
            {plan.name} pour {plan.price}.
          </p>
          <ul className="space-y-2 mb-5 text-sm text-ink">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-verify text-base flex-shrink-0">
                check_circle
              </span>
              <span>Publication d&apos;annonces illimitées</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-verify text-base flex-shrink-0">
                check_circle
              </span>
              <span>Messagerie illimitée avec vos contacts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-verify text-base flex-shrink-0">
                check_circle
              </span>
              <span>Annulation à tout moment</span>
            </li>
          </ul>
          <CheckoutButton role={user.role as 'regisseur' | 'installateur'} highlighted />
        </div>
      )}

      {user.role === 'commercial' && (
        <div className="bg-white rounded-2xl shadow-card border border-line p-6">
          <h3 className="display text-lg text-ink mb-2">Plan Commercial gratuit</h3>
          <p className="text-ink-soft text-sm">
            En tant que commercial, vous accédez gratuitement à toutes les fonctionnalités
            essentielles : recherche, messagerie illimitée et réponse aux annonces.
          </p>
        </div>
      )}

      {user.role !== 'commercial' && isActive && <CancelSubscriptionButton />}

      <p className="text-center text-xs text-ink-muted">
        Paiement sécurisé via Stripe · Annulation à tout moment
      </p>
    </div>
  );
}
