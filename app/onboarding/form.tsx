'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import SpecialtySelector from '@/app/components/SpecialtySelector';

type RoleCard = {
  value: UserRole;
  title: string;
  description: string;
  badge: string;
  icon: string;
};

const ROLES: RoleCard[] = [
  {
    value: 'commercial',
    title: 'Commercial',
    description: 'Je prospecte et vends pour des régies et installateurs.',
    badge: 'Gratuit',
    icon: 'handshake',
  },
  {
    value: 'regisseur',
    title: 'Régie',
    description: 'Je gère des commerciaux et cherche des installateurs.',
    badge: '9,99 € / mois',
    icon: 'business_center',
  },
  {
    value: 'installateur',
    title: 'Installateur',
    description: 'Je réalise les chantiers énergétiques (solaire, HVAC…).',
    badge: '9,99 € / mois',
    icon: 'construction',
  },
];

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export default function OnboardingForm({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const router = useRouter();
  const seed = splitName(defaultName);
  const [role, setRole] = useState<UserRole | null>(null);
  const [firstName, setFirstName] = useState(seed.firstName);
  const [lastName, setLastName] = useState(seed.lastName);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError('Choisissez votre rôle.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError('Nom et prénom sont obligatoires.');
      return;
    }
    if (!location.trim()) {
      setError('La ville est obligatoire.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    setSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: fullName,
          phone,
          location,
          website,
          bio: companyName ? `${companyName}\n\n${bio}` : bio,
          specialties,
          avatarUrl,
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: null }));
        throw new Error(msg || 'Erreur lors de la sauvegarde.');
      }
      if (role === 'commercial') {
        router.push('/dashboard');
      } else {
        router.push('/pricing?from=onboarding');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSubmitting(false);
    }
  };

  const isPro = role === 'regisseur' || role === 'installateur';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 1. Rôle */}
      <section className="bg-white rounded-2xl shadow-card border border-line p-6">
        <h2 className="display text-xl text-ink mb-1">1. Votre rôle</h2>
        <p className="text-sm text-ink-soft mb-4">Sélectionnez celui qui vous correspond.</p>
        <div className="grid md:grid-cols-3 gap-3">
          {ROLES.map((r) => {
            const selected = role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`text-left p-4 rounded-xl border-2 transition ${
                  selected
                    ? 'border-brand bg-brand-soft'
                    : 'border-line hover:border-ink-faint bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-xl ${
                        selected ? 'text-brand' : 'text-ink-muted'
                      }`}
                    >
                      {r.icon}
                    </span>
                    <h3 className="display text-base text-ink">{r.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.badge === 'Gratuit'
                        ? 'bg-verify-soft text-verify'
                        : 'bg-paper-tint text-ink-soft'
                    }`}
                  >
                    {r.badge}
                  </span>
                </div>
                <p className="text-sm text-ink-soft leading-snug">{r.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Identité */}
      <section className="bg-white rounded-2xl shadow-card border border-line p-6 space-y-4">
        <div>
          <h2 className="display text-xl text-ink">2. Votre identité</h2>
          <p className="text-sm text-ink-soft">
            Ces informations seront visibles sur votre profil public.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Prénom *">
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              placeholder="Marc"
            />
          </Field>
          <Field label="Nom *">
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
              placeholder="Lemaire"
            />
          </Field>
          <Field label="Adresse email *">
            <input
              type="email"
              value={email}
              disabled
              className="input bg-paper-tint text-ink-muted cursor-not-allowed"
            />
          </Field>
          <Field label="Téléphone *">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              className="input"
            />
          </Field>
          <Field label="Ville *">
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Paris, France"
              className="input"
            />
          </Field>
          <Field label="Site web (facultatif)">
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://monsite.fr"
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* 3. Entreprise (régie / installateur) */}
      {isPro && (
        <section className="bg-white rounded-2xl shadow-card border border-line p-6 space-y-4">
          <div>
            <h2 className="display text-xl text-ink">3. Votre entreprise</h2>
            <p className="text-sm text-ink-soft">
              Ajoutez un logo et une présentation — c&apos;est ce que verront les commerciaux.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nom de l&apos;entreprise (facultatif)">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Solaris Rhône-Alpes"
                className="input"
              />
            </Field>
            <Field label="Logo de l&apos;entreprise — URL (facultatif)">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…/logo.png"
                className="input"
              />
            </Field>
          </div>

          <Field label="Biographie de l&apos;entreprise (facultatif)">
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Présentez votre entreprise, vos certifications (RGE, QualiPV…), votre zone d&apos;intervention…"
              className="input"
            />
          </Field>
        </section>
      )}

      {!isPro && role && (
        <section className="bg-white rounded-2xl shadow-card border border-line p-6 space-y-4">
          <div>
            <h2 className="display text-xl text-ink">3. Votre présentation</h2>
            <p className="text-sm text-ink-soft">Dites aux régies et installateurs qui vous êtes.</p>
          </div>
          <Field label="Photo de profil — URL (facultatif)">
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…/photo.jpg"
              className="input"
            />
          </Field>
          <Field label="Bio courte (facultatif)">
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parlez brièvement de votre activité, votre secteur, votre expérience…"
              className="input"
            />
          </Field>
        </section>
      )}

      {/* 4. Métiers et spécialités */}
      <section className="bg-white rounded-2xl shadow-card border border-line p-6">
        <div className="mb-5">
          <h2 className="display text-xl text-ink">
            {role ? '4.' : '3.'} Métiers & spécialités
          </h2>
        </div>
        <SpecialtySelector value={specialties} onChange={setSpecialties} />
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors disabled:opacity-60"
        >
          {submitting ? 'Enregistrement…' : 'Activer mon compte'}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--color-line);
          border-radius: 0.5rem;
          outline: none;
          font-size: 0.875rem;
          background: white;
          color: var(--color-ink);
        }
        :global(.input:focus) {
          border-color: var(--color-brand);
          box-shadow: 0 0 0 2px var(--color-brand-ring);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink mb-1.5">{label}</span>
      {children}
    </label>
  );
}
