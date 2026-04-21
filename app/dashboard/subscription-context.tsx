'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useState } from 'react';

type SubscriptionState = {
  requiresSubscription: boolean;
  isSubscribed: boolean;
};

type ContextValue = {
  state: SubscriptionState;
  ensureSubscribed: () => boolean;
  openGate: () => void;
};

const SubscriptionCtx = createContext<ContextValue | null>(null);

export function SubscriptionProvider({
  state,
  children,
}: {
  state: SubscriptionState;
  children: React.ReactNode;
}) {
  const [gateOpen, setGateOpen] = useState(false);

  const ensureSubscribed = useCallback(() => {
    if (state.requiresSubscription && !state.isSubscribed) {
      setGateOpen(true);
      return false;
    }
    return true;
  }, [state.requiresSubscription, state.isSubscribed]);

  const openGate = useCallback(() => setGateOpen(true), []);

  return (
    <SubscriptionCtx.Provider value={{ state, ensureSubscribed, openGate }}>
      {children}
      {gateOpen && <SubscriptionGateModal onClose={() => setGateOpen(false)} />}
    </SubscriptionCtx.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionCtx);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}

function SubscriptionGateModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-brand text-2xl">workspace_premium</span>
          </div>
          <div>
            <h3 className="display text-xl text-ink">Il faut s&apos;abonner</h3>
            <p className="text-ink-soft text-sm mt-1">
              Cette action nécessite un abonnement actif (9,99 € / mois).
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-ink-soft hover:bg-paper-tint rounded-lg font-semibold text-sm"
          >
            Plus tard
          </button>
          <Link
            href="/dashboard/subscription"
            onClick={onClose}
            className="px-5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors"
          >
            S&apos;abonner
          </Link>
        </div>
      </div>
    </div>
  );
}
