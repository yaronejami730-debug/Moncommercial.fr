import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings } from '@/lib/db/schema';
import type { ListingCategory } from '@/lib/types';
import NewListingButton from './new-listing-button';

const CATEGORY_LABEL: Record<ListingCategory, string> = {
  collaboration: 'Collaboration',
  rdv: 'Rendez-vous',
  project: 'Projet',
};

export default async function ListingsPage() {
  const me = await requireOnboarded();

  const mine = await db
    .select()
    .from(listings)
    .where(eq(listings.userId, me.id))
    .orderBy(desc(listings.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="display text-3xl text-ink">Mes annonces</h1>
          <p className="text-ink-soft mt-2">Gérez vos annonces publiées.</p>
        </div>
        <NewListingButton />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        {mine.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-brand text-2xl">list_alt</span>
            </div>
            <p className="text-ink-soft">Aucune annonce. Créez-en une pour commencer.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {mine.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/dashboard/listings/${l.id}`}
                  className="block px-6 py-4 hover:bg-paper-tint transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="display text-base text-ink truncate">{l.title}</h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-soft text-brand">
                          {CATEGORY_LABEL[l.category]}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            l.status === 'active'
                              ? 'bg-verify-soft text-verify'
                              : 'bg-paper-tint text-ink-soft'
                          }`}
                        >
                          {l.status === 'active' ? 'Active' : 'Fermée'}
                        </span>
                      </div>
                      <p className="text-sm text-ink-soft mt-1 line-clamp-2">{l.description}</p>
                      <p className="text-xs text-ink-muted mt-1.5 flex items-center gap-3 flex-wrap">
                        {l.location && (
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {l.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {new Date(l.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-ink-faint">chevron_right</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
