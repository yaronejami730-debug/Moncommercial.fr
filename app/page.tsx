'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FEATURED_SPECIALTIES, SPECIALTY_CATALOG } from '@/lib/specialties';

const featuredPros = [
  {
    initial: 'S',
    initialBg: 'bg-brand',
    name: 'Solaris Rhône-Alpes',
    role: 'Régie',
    zone: 'Lyon · 69',
    specialty: 'Photovoltaïque · PAC',
    rating: 4.9,
    reviews: 87,
    verified: true,
    price: "à partir de 0€",
    tagline: "Nous cherchons des installateurs RGE pour 24 chantiers.",
    lastActive: 'en ligne',
  },
  {
    initial: 'T',
    initialBg: 'bg-verify',
    name: 'ThermoPro Grand Est',
    role: 'Installateur',
    zone: 'Metz · 57',
    specialty: 'PAC air/eau · Isolation',
    rating: 4.8,
    reviews: 142,
    verified: true,
    price: "Dispo sous 48h",
    tagline: "10 ans d'expérience. Certifié RGE QualiPAC.",
    lastActive: 'il y a 2h',
  },
  {
    initial: 'M',
    initialBg: 'bg-star',
    name: 'Marc L.',
    role: 'Commercial',
    zone: 'Bordeaux · 33',
    specialty: 'Résidentiel PV',
    rating: 5.0,
    reviews: 23,
    verified: true,
    price: "Disponible",
    tagline: "Apporteur d'affaires · 8 dossiers signés ce mois-ci.",
    lastActive: 'en ligne',
  },
  {
    initial: 'É',
    initialBg: 'bg-brand',
    name: 'ÉcoWatt Bretagne',
    role: 'Régie',
    zone: 'Rennes · 35',
    specialty: "CEE · MaPrimeRénov'",
    rating: 4.7,
    reviews: 56,
    verified: true,
    price: "à partir de 0€",
    tagline: "Recrute 5 commerciaux terrain sur la région.",
    lastActive: 'il y a 1h',
  },
];

const specialties = FEATURED_SPECIALTIES;

const regions = [
  'Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie',
  'Hauts-de-France', 'Grand Est', 'Provence-Alpes-Côte d\'Azur', 'Bretagne',
  'Pays de la Loire', 'Normandie', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire',
];

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [searchRole, setSearchRole] = useState('installateur');
  const [searchZone, setSearchZone] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setIsSignedIn(Boolean(d?.user)))
      .catch(() => setIsSignedIn(false));
  }, []);

  return (
    <div className="bg-paper text-ink min-h-screen">
      {/* ── Header ────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-6 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center flex-shrink-0" aria-label="MonCommercial.fr — accueil">
            <Image
              src="/logo.png"
              alt="MonCommercial.fr"
              width={1092}
              height={190}
              priority
              className="h-11 md:h-14 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-ink-soft">
            <a href="#pros" className="hover:text-ink transition-colors font-medium">Trouver un pro</a>
            <a href="#comment" className="hover:text-ink transition-colors font-medium">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-ink transition-colors font-medium">Tarifs</a>
            <a href="#faq" className="hover:text-ink transition-colors font-medium">FAQ</a>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isSignedIn ? (
              <Link href="/dashboard" className="px-4 py-2 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-hover transition-colors">
                Mon espace
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-in" className="hidden sm:inline px-3 py-2 text-sm font-semibold text-ink hover:text-brand transition-colors">
                  Connexion
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-hover transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── 1. HERO avec recherche ──────────────── */}
      <section className="bg-paper-warm border-b border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-white border border-line rounded-full px-3 py-1.5 mb-6 shadow-sm">
              <span className="material-symbols-outlined filled text-star text-base">star</span>
              <span className="text-xs font-bold text-ink">
                4,8/5 · 2 137 pros inscrits
              </span>
            </div>

            <h1 className="display text-4xl md:text-6xl text-ink leading-[1.05] mb-5">
              Trouvez le bon<br />
              <span className="text-brand">partenaire énergie</span><br />
              près de chez vous.
            </h1>

            <p className="text-lg md:text-xl text-ink-soft mb-8 max-w-xl leading-relaxed">
              Installateurs, régies et commerciaux du secteur énergie — l'annuaire
              pro pour vous trouver, vous contacter, avancer ensemble.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl border border-line shadow-card p-3 flex flex-col md:flex-row gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-2 px-3">
                <span className="material-symbols-outlined text-ink-muted text-xl">person_search</span>
                <select
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-ink focus:outline-none cursor-pointer py-2"
                >
                  <option value="installateur">Un installateur</option>
                  <option value="regie">Une régie</option>
                  <option value="commercial">Un commercial</option>
                </select>
              </div>
              <div className="h-px md:h-auto md:w-px bg-line md:my-2" />
              <div className="flex-1 flex items-center gap-2 px-3">
                <span className="material-symbols-outlined text-ink-muted text-xl">location_on</span>
                <input
                  value={searchZone}
                  onChange={(e) => setSearchZone(e.target.value)}
                  placeholder="Ville, code postal ou région"
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none py-2"
                />
              </div>
              <Link
                href="/auth/sign-up"
                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-base">search</span>
                Rechercher
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-soft mt-6">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-verify text-base">verified</span>
                SIRET vérifié
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-verify text-base">bolt</span>
                Premier contact en 1 heure
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-verify text-base">favorite</span>
                Gratuit pour les commerciaux
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Stack of profile previews to give a visual */}
            <div className="relative h-[420px] hidden lg:block">
              <div className="absolute top-0 right-8 w-72 bg-white rounded-2xl shadow-card p-5 rotate-[3deg] border border-line">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white display text-xl">S</div>
                  <div>
                    <p className="display text-sm flex items-center gap-1">
                      Solaris Rhône-Alpes
                      <span className="material-symbols-outlined text-verify text-sm">verified</span>
                    </p>
                    <p className="text-xs text-ink-muted">Régie · Lyon · 69</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-star mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined filled text-sm">star</span>
                  ))}
                  <span className="text-xs text-ink-soft ml-1">4,9 · 87 avis</span>
                </div>
                <p className="text-xs text-ink-soft leading-snug">
                  Cherche installateurs RGE pour 24 chantiers.
                </p>
              </div>

              <div className="absolute top-36 left-0 w-72 bg-white rounded-2xl shadow-card p-5 rotate-[-4deg] border border-line">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-verify flex items-center justify-center text-white display text-xl">T</div>
                  <div>
                    <p className="display text-sm flex items-center gap-1">
                      ThermoPro Grand Est
                      <span className="material-symbols-outlined text-verify text-sm">verified</span>
                    </p>
                    <p className="text-xs text-ink-muted">Installateur · Metz · 57</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-star mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined filled text-sm">star</span>
                  ))}
                  <span className="text-xs text-ink-soft ml-1">4,8 · 142 avis</span>
                </div>
                <p className="text-xs text-ink-soft leading-snug">
                  10 ans d'exp · Certifié RGE QualiPAC.
                </p>
              </div>

              <div className="absolute top-72 right-16 w-72 bg-white rounded-2xl shadow-card p-5 rotate-[2deg] border border-line">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-star flex items-center justify-center text-white display text-xl">M</div>
                  <div>
                    <p className="display text-sm flex items-center gap-1">
                      Marc L.
                      <span className="material-symbols-outlined text-verify text-sm">verified</span>
                    </p>
                    <p className="text-xs text-ink-muted">Commercial · Bordeaux · 33</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-star mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined filled text-sm">star</span>
                  ))}
                  <span className="text-xs text-ink-soft ml-1">5,0 · 23 avis</span>
                </div>
                <p className="text-xs text-ink-soft leading-snug">
                  8 dossiers signés ce mois-ci.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Spécialités ──────────────────────── */}
      <section className="py-14 md:py-20 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="display text-2xl md:text-3xl text-ink mb-1">
                Recherchez par spécialité
              </h2>
              <p className="text-ink-soft text-sm">Plus de 2 000 pros référencés sur 6 univers</p>
            </div>
            <a href="#pros" className="text-brand font-bold text-sm flex items-center gap-1 hover:underline">
              Toutes les spécialités
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {specialties.map((s) => (
              <Link
                key={s.label}
                href={`/auth/sign-up?specialty=${encodeURIComponent(s.match)}`}
                className="bg-white border border-line rounded-2xl p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <p className="display text-sm text-ink mb-0.5">{s.label}</p>
                <p className="text-xs text-ink-muted">Voir les pros</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-white border border-line rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div>
                <p className="display text-lg text-ink">Tous les métiers de la rénovation énergétique</p>
                <p className="text-xs text-ink-muted">Artisans, ingénieurs, commerciaux, bureaux d&apos;études, dossiers d&apos;aides — tout le marché au même endroit.</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand bg-brand-soft px-3 py-1 rounded-full">
                {SPECIALTY_CATALOG.length} familles · {SPECIALTY_CATALOG.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0)} métiers
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPECIALTY_CATALOG.map((cat) => (
                <div key={cat.key} className="rounded-xl border border-line-soft p-4 bg-paper-warm/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">{cat.icon}</span>
                    </span>
                    <p className="display text-sm text-ink">{cat.label}</p>
                  </div>
                  <p className="text-xs text-ink-soft leading-snug">
                    {cat.groups.flatMap((g) => g.items).slice(0, 4).join(' · ')}
                    {cat.groups.flatMap((g) => g.items).length > 4 ? '…' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Pros en avant ────────────────────── */}
      <section id="pros" className="py-14 md:py-20 bg-paper-tint border-b border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="display text-2xl md:text-4xl text-ink mb-1">
                Les pros en avant cette semaine
              </h2>
              <p className="text-ink-soft text-sm">Sélection d'installateurs, régies et commerciaux actifs sur la plateforme</p>
            </div>
            <Link href="/auth/sign-up" className="hidden md:inline-flex items-center gap-1 text-brand font-bold text-sm hover:underline">
              Voir tous les pros
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPros.map((p) => (
              <article
                key={p.name}
                className="bg-white border border-line rounded-2xl p-5 hover:shadow-card transition-shadow"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${p.initialBg} flex items-center justify-center text-white display text-lg flex-shrink-0`}>
                    {p.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="display text-base text-ink flex items-center gap-1 truncate">
                      {p.name}
                      {p.verified && (
                        <span className="material-symbols-outlined text-verify text-base flex-shrink-0" title="Vérifié">
                          verified
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {p.role} · {p.zone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined filled text-star text-sm">star</span>
                  ))}
                  <span className="text-xs font-bold text-ink ml-1">{p.rating.toFixed(1).replace('.', ',')}</span>
                  <span className="text-xs text-ink-muted">· {p.reviews} avis</span>
                </div>

                <p className="text-sm text-ink-soft leading-snug mb-4 line-clamp-2">
                  {p.tagline}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-line-soft text-xs">
                  <span className="text-ink-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">circle</span>
                    {p.lastActive}
                  </span>
                  <span className="text-ink font-semibold">{p.specialty.split(' · ')[0]}</span>
                </div>

                <Link
                  href="/auth/sign-up"
                  className="mt-4 block text-center bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                >
                  Contacter
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-1 bg-white border border-line text-ink font-bold text-sm px-6 py-3 rounded-full hover:border-brand hover:text-brand transition-colors"
            >
              Voir tous les pros
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Comment ça marche ────────────────── */}
      <section id="comment" className="py-14 md:py-24 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-brand font-bold text-xs uppercase tracking-wider mb-2">Comment ça marche</p>
            <h2 className="display text-3xl md:text-5xl text-ink leading-tight">
              Prêt en deux minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', icon: 'person_add', t: 'Créez votre profil', d: "Choisissez votre rôle, renseignez votre SIRET. On vérifie vos infos en coulisses." },
              { n: '2', icon: 'travel_explore', t: 'Cherchez dans votre zone', d: "Filtrez par rôle, région, spécialité. Les bons pros apparaissent en quelques secondes." },
              { n: '3', icon: 'chat', t: 'Prenez contact', d: "Messagerie intégrée. Vous échangez en direct, vous décidez, vous avancez." },
            ].map((s, i) => (
              <div key={s.n} className="relative text-center px-4">
                <div className="relative inline-flex w-16 h-16 rounded-2xl bg-brand-soft text-brand items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand text-white display text-xs flex items-center justify-center">
                    {s.n}
                  </span>
                </div>
                <h3 className="display text-xl text-ink mb-2">{s.t}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{s.d}</p>
                {i < 2 && (
                  <span className="hidden md:block absolute top-8 right-[-12px] text-ink-faint text-2xl">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Témoignages ──────────────────────── */}
      <section className="py-14 md:py-20 bg-paper-tint border-b border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-brand font-bold text-xs uppercase tracking-wider mb-2">Ils en parlent</p>
              <h2 className="display text-2xl md:text-4xl text-ink leading-tight">
                4,8/5 sur 412 avis vérifiés
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Camille D.', role: 'Régie · Lyon', quote: "En deux semaines, j'ai trouvé 4 installateurs RGE sur mon secteur. Normalement j'y passe deux mois au téléphone.", time: 'il y a 3 jours' },
              { name: 'Thomas R.', role: 'Installateur · Nantes', quote: "Fini les relances. Les régies me contactent en direct. 9,99€, c'est dérisoire face au temps gagné.", time: 'il y a 1 semaine' },
              { name: 'Yasmine L.', role: 'Commerciale · Paris', quote: "Gratuit pour les commerciaux, j'ai douté au début. C'est réel. Je recommande à toute l'équipe.", time: 'il y a 2 semaines' },
            ].map((t) => (
              <figure key={t.name} className="bg-white border border-line rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined filled text-star text-base">star</span>
                  ))}
                </div>
                <blockquote className="text-ink leading-relaxed text-[15px] mb-5">
                  « {t.quote} »
                </blockquote>
                <figcaption className="flex items-center justify-between text-xs pt-4 border-t border-line-soft">
                  <div>
                    <p className="display text-sm text-ink">{t.name}</p>
                    <p className="text-ink-muted">{t.role}</p>
                  </div>
                  <span className="text-ink-muted">{t.time}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Tarifs ────────────────────────────── */}
      <section id="tarifs" className="py-14 md:py-24 border-b border-line">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-brand font-bold text-xs uppercase tracking-wider mb-2">Tarifs</p>
            <h2 className="display text-3xl md:text-5xl text-ink leading-tight mb-4">
              Clair. Net. Honnête.
            </h2>
            <div className="inline-flex items-center gap-2 bg-brand-soft text-brand px-4 py-1.5 rounded-full text-sm font-bold">
              <span className="material-symbols-outlined filled text-base">star</span>
              Essai 3 jours · CB requise · Sans engagement
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pros */}
            <div className="bg-white border-2 border-line rounded-2xl p-8 relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                    Installateurs &amp; Régies
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="display text-5xl text-ink">9,99€</span>
                    <span className="text-ink-muted text-sm">/mois HT</span>
                  </div>
                  <p className="text-xs text-ink-muted mt-1">Après 3 jours d'essai gratuit</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-sm text-ink mb-7">
                {[
                  'Profil vérifié SIRET + RGE',
                  'Visibilité nationale',
                  'Messagerie illimitée',
                  'Notes et avis vérifiés',
                  'Annulation en 1 clic',
                  'Support humain français',
                ].map((t) => (
                  <li key={t} className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-verify text-base">check_circle</span>
                    {t}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/sign-up"
                className="block text-center bg-brand hover:bg-brand-hover text-white font-bold text-sm rounded-xl py-3.5 transition-colors"
              >
                Démarrer l'essai de 3 jours
              </Link>
              <p className="text-[11px] text-ink-muted mt-3 text-center">
                CB demandée · annulation avant facturation
              </p>
            </div>

            {/* Commerciaux */}
            <div className="bg-ink text-white border-2 border-ink rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                      Commerciaux
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="display text-5xl">0€</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">Gratuit · sans carte bancaire</p>
                  </div>
                  <span className="bg-brand text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    À vie
                  </span>
                </div>

                <ul className="space-y-2.5 text-sm text-white/90 mb-7">
                  {[
                    'Profil commercial',
                    'Accès à tout l\'annuaire',
                    'Messagerie illimitée',
                    'Notes et avis',
                    'Aucune limite',
                    'Aucune CB demandée',
                  ].map((t) => (
                    <li key={t} className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-brand text-base">check_circle</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/sign-up"
                  className="block text-center bg-white hover:bg-paper-tint text-ink font-bold text-sm rounded-xl py-3.5 transition-colors"
                >
                  Créer mon profil gratuit
                </Link>
                <p className="text-[11px] text-white/50 mt-3 text-center">
                  Aucun paiement, jamais
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-ink-soft mt-8 max-w-xl mx-auto">
            Les commerciaux sont gratuits parce qu'ils font travailler les régies et les installateurs.
            C'est eux qui paient leur présence sur la plateforme.
          </p>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────── */}
      <section id="faq" className="py-14 md:py-20 bg-paper-tint border-b border-line">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-brand font-bold text-xs uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="display text-3xl md:text-4xl text-ink">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-2">
            {[
              { q: "C'est vraiment gratuit pour les commerciaux ?", a: "Oui. Aucune carte bancaire, aucune limite, à vie. Les régies et installateurs paient parce qu'ils gagnent du business grâce aux commerciaux — ils paient leur présence sur la plateforme." },
              { q: "Comment marche l'essai de 3 jours ?", a: "Vous rentrez votre CB, vous testez la plateforme pendant 72 heures. Si vous annulez avant la fin de la période, aucun prélèvement n'est effectué. Sans engagement." },
              { q: "Comment j'annule mon abonnement ?", a: "En 1 clic depuis votre espace, à tout moment. Aucune justification, aucun frais, aucune question." },
              { q: "Qui peut s'inscrire ?", a: "Les pros du secteur énergie en France : installateurs (PV, PAC, isolation, biomasse), régies énergie, commerciaux terrain. SIRET vérifié à l'inscription." },
              { q: "Mes données sont en sécurité ?", a: "Hébergement en France, conformité RGPD, aucune revente. On est des pros aussi — on sait ce que vaut la confidentialité." },
              { q: "Puis-je changer de rôle plus tard ?", a: "Oui. Depuis votre espace, vous pouvez basculer ou cumuler plusieurs rôles si votre activité le justifie." },
            ].map((item) => (
              <details
                key={item.q}
                className="group bg-white border border-line rounded-xl"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                  <span className="display text-base text-ink">{item.q}</span>
                  <span className="material-symbols-outlined text-brand group-open:rotate-45 transition-transform">
                    add
                  </span>
                </summary>
                <p className="px-5 pb-5 text-ink-soft leading-relaxed text-[15px]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA final ─────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-brand rounded-[28px] px-6 md:px-14 py-14 md:py-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="display text-3xl md:text-5xl leading-tight mb-4">
                Prêt à trouver vos<br />prochains partenaires&nbsp;?
              </h2>
              <p className="text-white/90 text-base md:text-lg mb-8">
                Créez votre profil en 2 minutes. Testez 3 jours gratuitement. Décidez après.
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 bg-white text-brand font-bold text-base px-8 py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-transform shadow-xl"
              >
                Je crée mon profil
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <p className="text-white/70 text-xs mt-5">
                Gratuit à vie pour les commerciaux · 9,99€/mois pour les pros après l'essai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Régions (SEO / marketplace) ──────── */}
      <section className="py-14 bg-paper-tint border-t border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="display text-xl md:text-2xl text-ink mb-5">
            Des pros dans toute la France
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {regions.map((r) => (
              <a
                key={r}
                href="/auth/sign-up"
                className="text-sm text-ink-soft hover:text-brand hover:underline py-1.5"
              >
                Pros énergie en {r}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="bg-ink text-white/70">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-12 gap-8 pb-8 border-b border-white/10">
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-center mb-4 bg-white rounded-xl px-4 py-2 w-fit">
                <Image
                  src="/logo.png"
                  alt="MonCommercial.fr"
                  width={1092}
                  height={190}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                L'annuaire français des pros de l'énergie : installateurs, régies,
                commerciaux — ensemble, au même endroit.
              </p>
              <p className="text-xs uppercase tracking-widest text-white/40 mt-5">
                Made in France · 2026
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <p className="display text-white text-sm mb-4">Plateforme</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#pros" className="hover:text-white">Pros en avant</a></li>
                <li><a href="#comment" className="hover:text-white">Comment ça marche</a></li>
                <li><a href="#tarifs" className="hover:text-white">Tarifs</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <p className="display text-white text-sm mb-4">Société</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">À propos</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-3">
              <p className="display text-white text-sm mb-4">Légal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">CGU</a></li>
                <li><a href="#" className="hover:text-white">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <p className="text-xs pt-6">&copy; 2026 MonCommercial.fr — Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
