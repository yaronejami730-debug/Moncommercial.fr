'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/app/dashboard/subscription-context';

export default function CreateListingForm() {
  const router = useRouter();
  const { ensureSubscribed, openGate } = useSubscription();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'collaboration' | 'rdv' | 'project'>('collaboration');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureSubscribed()) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, location, budget }),
      });
      if (res.status === 402) {
        openGate();
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      router.push(`/dashboard/listings/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 border border-line rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand';

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-card border border-line p-6 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Titre *</label>
        <input
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Catégorie *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className={inputCls}
        >
          <option value="collaboration">Collaboration</option>
          <option value="rdv">Rendez-vous</option>
          <option value="project">Projet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Description *</label>
        <textarea
          required
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Ville</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Paris, France"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Budget</label>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="ex. 2 000 €"
            className={inputCls}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-ink-soft hover:bg-paper-tint rounded-lg font-semibold text-sm"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors disabled:opacity-60"
        >
          {submitting ? 'Publication…' : 'Publier'}
        </button>
      </div>
    </form>
  );
}
