'use client';

import { useState } from 'react';
import type { UserRole } from '@/lib/types';

export default function CheckoutButton({
  role,
  highlighted,
}: {
  role: UserRole;
  highlighted?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Erreur checkout');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onClick}
        disabled={loading}
        className={`block w-full px-5 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 ${
          highlighted
            ? 'bg-brand text-white hover:bg-brand-hover'
            : 'bg-ink text-white hover:bg-ink-soft'
        }`}
      >
        {loading ? 'Redirection…' : "S'abonner"}
      </button>
      {error && <p className="text-xs text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
}
