'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm('Supprimer cette annonce ?')) return;
    setLoading(true);
    const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/dashboard/listings');
      router.refresh();
    } else {
      alert('Erreur lors de la suppression.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="px-3 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
    >
      {loading ? 'Suppression…' : 'Supprimer'}
    </button>
  );
}
