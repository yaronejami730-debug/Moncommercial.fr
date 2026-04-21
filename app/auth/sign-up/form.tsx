'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Erreur lors de la création du compte');
      return;
    }
    router.push(data.redirect || '/onboarding');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Nom complet</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 border border-line rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 border border-line rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">
          Mot de passe <span className="text-ink-muted font-normal">(8+ caractères)</span>
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2.5 border border-line rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand"
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-5 py-3 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors disabled:opacity-60"
      >
        {loading ? 'Création…' : 'Créer mon compte'}
      </button>
    </form>
  );
}
