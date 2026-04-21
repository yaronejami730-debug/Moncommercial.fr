'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpecialtySelector from '@/app/components/SpecialtySelector';
import type { UserRole } from '@/lib/types';

type ProfileData = {
  name: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  email: string;
  role: UserRole | null;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export default function ProfileForm({ user }: { user: ProfileData }) {
  const router = useRouter();
  const seed = splitName(user.name);
  const [firstName, setFirstName] = useState(seed.firstName);
  const [lastName, setLastName] = useState(seed.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location);
  const [website, setWebsite] = useState(user.website);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [specialties, setSpecialties] = useState<string[]>(user.specialties);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const isPro = user.role === 'regisseur' || user.role === 'installateur';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        location,
        website,
        bio,
        avatarUrl,
        specialties,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Profil mis à jour.' });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage({ type: 'error', text: data.error || 'Erreur' });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Identité */}
      <section>
        <h2 className="display text-lg text-ink mb-1">Identité</h2>
        <p className="text-sm text-ink-soft mb-4">
          Informations visibles par les régies, installateurs et commerciaux.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Prénom *">
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Nom *">
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Adresse email">
            <input
              type="email"
              value={user.email}
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
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Site web (facultatif)">
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://…"
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* Logo / photo + bio */}
      <section>
        <h2 className="display text-lg text-ink mb-1">
          {isPro ? 'Entreprise' : 'Présentation'}
        </h2>
        <p className="text-sm text-ink-soft mb-4">
          {isPro
            ? "Logo et biographie de l'entreprise — affichés sur votre profil."
            : 'Photo et bio courte — affichés sur votre profil.'}
        </p>
        <div className="space-y-4">
          <Field
            label={
              isPro
                ? 'Logo de l’entreprise — URL (facultatif)'
                : 'Photo de profil — URL (facultatif)'
            }
          >
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className="input"
            />
            {avatarUrl && (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt="Aperçu"
                  className="w-16 h-16 rounded-xl object-cover border border-line"
                />
                <p className="text-xs text-ink-muted">Aperçu</p>
              </div>
            )}
          </Field>
          <Field
            label={
              isPro
                ? 'Biographie de l’entreprise (facultatif)'
                : 'Bio courte (facultatif)'
            }
          >
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={
                isPro
                  ? 'Présentez votre entreprise, certifications, zone d’intervention…'
                  : 'Parlez brièvement de votre activité…'
              }
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* Spécialités */}
      <section>
        <SpecialtySelector value={specialties} onChange={setSpecialties} />
      </section>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === 'ok'
              ? 'bg-verify-soft border border-verify/20 text-verify'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors disabled:opacity-60"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink mb-1.5">{label}</span>
      {children}
    </label>
  );
}
