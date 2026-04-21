'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSubscription } from '@/app/dashboard/subscription-context';

export default function MessageComposer({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { ensureSubscribed, openGate } = useSubscription();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    if (!ensureSubscribed()) return;
    setSending(true);
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setSending(false);
    if (res.status === 402) {
      openGate();
      return;
    }
    if (res.ok) {
      setText('');
      router.refresh();
    } else {
      alert("Erreur d'envoi");
    }
  };

  return (
    <form onSubmit={send} className="pt-3 border-t border-line flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrire un message…"
        className="flex-1 px-4 py-2.5 border border-line rounded-full text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand"
      />
      <button
        type="submit"
        disabled={sending || !text.trim()}
        className="px-5 py-2.5 bg-brand text-white rounded-full hover:bg-brand-hover disabled:opacity-50 font-bold text-sm transition-colors"
      >
        Envoyer
      </button>
    </form>
  );
}
