'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SPECIALTY_CATALOG } from '@/lib/specialties';

const ROLES = [
  { value: '', label: 'Tous les rôles' },
  { value: 'commercial', label: 'Commerciaux' },
  { value: 'regisseur', label: 'Régies' },
  { value: 'installateur', label: 'Installateurs' },
];

export default function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(params.get('q') ?? '');
  const [role, setRole] = useState(params.get('role') ?? '');
  const [location, setLocation] = useState(params.get('location') ?? '');
  const [specialty, setSpecialty] = useState(params.get('specialty') ?? '');

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (role) next.set('role', role);
    if (location) next.set('location', location);
    if (specialty) next.set('specialty', specialty);
    startTransition(() => {
      router.push(`/dashboard/search?${next.toString()}`);
    });
  };

  const reset = () => {
    setQ('');
    setRole('');
    setLocation('');
    setSpecialty('');
    startTransition(() => router.push('/dashboard/search'));
  };

  const inputCls =
    'px-3 py-2.5 border border-line rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand';

  return (
    <form
      onSubmit={apply}
      className="bg-white rounded-2xl shadow-card border border-line p-4 grid md:grid-cols-5 gap-3"
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Nom…"
        className={`md:col-span-2 ${inputCls}`}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className={inputCls}
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Ville"
        className={inputCls}
      />
      <select
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        className={inputCls}
      >
        <option value="">Toutes spécialités</option>
        {SPECIALTY_CATALOG.map((cat) => (
          <optgroup key={cat.key} label={cat.label}>
            {cat.groups.flatMap((g) => g.items).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="md:col-span-5 flex gap-2 justify-end">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 text-sm text-ink-soft hover:bg-paper-tint rounded-lg font-semibold"
        >
          Réinitialiser
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 text-sm bg-brand text-white rounded-xl hover:bg-brand-hover font-bold transition-colors disabled:opacity-60"
        >
          {isPending ? 'Recherche…' : 'Rechercher'}
        </button>
      </div>
    </form>
  );
}
