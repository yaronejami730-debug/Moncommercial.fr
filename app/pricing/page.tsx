import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import CheckoutButton from './checkout-button';

const PLANS = [
  {
    role: 'commercial' as const,
    name: 'Commercial',
    price: '0 €',
    period: 'Gratuit',
    description: 'Pour les commerciaux indépendants qui prospectent.',
    icon: 'handshake',
    features: [
      'Création de profil complet',
      'Recherche de régies et installateurs',
      'Messagerie illimitée',
      'Réponse aux annonces',
    ],
  },
  {
    role: 'regisseur' as const,
    name: 'Régie',
    price: '9,99 €',
    period: '/ mois',
    description: 'Pour les régies qui recrutent commerciaux et installateurs.',
    icon: 'business_center',
    features: [
      'Tout le plan Commercial',
      "Publication d'annonces illimitées",
      'Contact direct avec commerciaux',
      'Support prioritaire',
    ],
    highlighted: true,
  },
  {
    role: 'installateur' as const,
    name: 'Installateur',
    price: '9,99 €',
    period: '/ mois',
    description: 'Pour les installateurs qui cherchent projets et partenaires.',
    icon: 'construction',
    features: [
      'Tout le plan Commercial',
      "Publication d'annonces illimitées",
      'Mise en avant des spécialités',
      'Support prioritaire',
    ],
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-paper-warm py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center mb-6" aria-label="Centrale de l'Énergie — accueil">
            <Image
              src="/logo.png"
              alt="Centrale de l'Énergie"
              width={1092}
              height={190}
              priority
              className="h-20 w-auto"
            />
          </Link>
          <h1 className="display text-4xl md:text-5xl text-ink leading-tight">
            Abonnements
          </h1>
          <p className="text-ink-soft mt-4 text-lg max-w-2xl mx-auto">
            Les commerciaux sont gratuits. Régies et installateurs : 9,99 € / mois.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.role}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col ${
                p.highlighted
                  ? 'border-brand shadow-card-hover md:scale-105'
                  : 'border-line shadow-card'
              }`}
            >
              {p.highlighted && (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-brand bg-brand-soft px-2.5 py-1 rounded-full self-start mb-3">
                  <span className="material-symbols-outlined filled text-sm">star</span>
                  Le plus populaire
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-brand text-2xl">{p.icon}</span>
                <h2 className="display text-2xl text-ink">{p.name}</h2>
              </div>
              <div className="mt-3 mb-4">
                <span className="display text-4xl text-ink">{p.price}</span>
                <span className="text-ink-soft ml-1 text-sm">{p.period}</span>
              </div>
              <p className="text-ink-soft text-sm mb-5">{p.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <span className="material-symbols-outlined text-verify text-base flex-shrink-0">
                      check_circle
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {!user ? (
                <Link
                  href="/auth/sign-up"
                  className={`block w-full text-center px-5 py-3 rounded-xl font-bold text-sm transition-colors ${
                    p.highlighted
                      ? 'bg-brand text-white hover:bg-brand-hover'
                      : 'bg-ink text-white hover:bg-ink-soft'
                  }`}
                >
                  Créer un compte
                </Link>
              ) : p.role === 'commercial' ? (
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-5 py-3 border border-line text-ink rounded-xl hover:bg-paper-tint font-bold text-sm transition-colors"
                >
                  Accéder au tableau de bord
                </Link>
              ) : (
                <CheckoutButton role={p.role} highlighted={p.highlighted} />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ink-muted mt-10">
          Paiement sécurisé via Stripe · Annulation à tout moment
        </p>
      </div>
    </div>
  );
}
