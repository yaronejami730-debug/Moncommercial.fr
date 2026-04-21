'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CancelSubscriptionButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/cancel', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setConfirming(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card border-2 border-red-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
          <h3 className="display text-xl text-ink">Annuler l&apos;abonnement</h3>
        </div>
        <p className="text-ink-soft text-sm mb-5">
          Vous perdrez immédiatement l&apos;accès à la publication d&apos;annonces et à la messagerie.
          Vous pourrez vous réabonner à tout moment.
        </p>
        <button
          onClick={() => setConfirming(true)}
          className="w-full px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-base transition-colors inline-flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">cancel</span>
          Annuler mon abonnement
        </button>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !loading && setConfirming(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
              </div>
              <div>
                <h3 className="display text-xl text-ink">Confirmer l&apos;annulation</h3>
                <p className="text-ink-soft text-sm mt-1">
                  Êtes-vous sûr de vouloir annuler votre abonnement ? L&apos;accès aux
                  fonctionnalités premium sera immédiatement coupé.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-3">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setConfirming(false)}
                disabled={loading}
                className="px-4 py-2.5 text-ink-soft hover:bg-paper-tint rounded-lg font-semibold text-sm disabled:opacity-60"
              >
                Garder l&apos;abonnement
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Annulation…' : 'Oui, annuler'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
