'use client';

import { useRouter } from 'next/navigation';
import { useSubscription } from '@/app/dashboard/subscription-context';

export default function NewListingButton() {
  const router = useRouter();
  const { ensureSubscribed } = useSubscription();

  const onClick = () => {
    if (!ensureSubscribed()) return;
    router.push('/dashboard/listings/create');
  };

  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover font-bold text-sm transition-colors inline-flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-base">add</span>
      Nouvelle annonce
    </button>
  );
}
