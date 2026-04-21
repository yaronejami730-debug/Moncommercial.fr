import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings, users } from '@/lib/db/schema';
import type { ListingCategory, UserRole } from '@/lib/types';
import DeleteListingButton from './delete-button';

const CATEGORY_LABEL: Record<ListingCategory, string> = {
  collaboration: 'Collaboration',
  rdv: 'Rendez-vous',
  project: 'Projet',
};

const ROLE_LABEL: Record<UserRole, string> = {
  commercial: 'Commercial',
  regisseur: 'Régie',
  installateur: 'Installateur',
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireOnboarded();

  const [row] = await db
    .select({
      listing: listings,
      author: {
        id: users.id,
        name: users.name,
        role: users.role,
        location: users.location,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .where(eq(listings.id, id))
    .limit(1);

  if (!row) notFound();

  const isOwner = row.author.id === me.id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/listings"
          className="text-sm text-ink-soft hover:text-ink inline-flex items-center gap-1 font-semibold"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Retour aux annonces
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-card border border-line p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-soft text-brand">
                {CATEGORY_LABEL[row.listing.category]}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  row.listing.status === 'active'
                    ? 'bg-verify-soft text-verify'
                    : 'bg-paper-tint text-ink-soft'
                }`}
              >
                {row.listing.status === 'active' ? 'Active' : 'Fermée'}
              </span>
            </div>
            <h1 className="display text-3xl text-ink">{row.listing.title}</h1>
            <p className="text-sm text-ink-muted mt-2 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Publiée le {new Date(row.listing.createdAt).toLocaleDateString('fr-FR')}
              </span>
              {row.listing.location && (
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {row.listing.location}
                </span>
              )}
              {row.listing.budget && (
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">euro</span>
                  {row.listing.budget}
                </span>
              )}
            </p>
          </div>
          {isOwner && <DeleteListingButton listingId={row.listing.id} />}
        </div>

        <div className="whitespace-pre-wrap text-ink leading-relaxed pt-2">
          {row.listing.description}
        </div>
      </article>

      <aside className="bg-white rounded-2xl shadow-card border border-line p-6">
        <h2 className="display text-base text-ink mb-3">Publié par</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center overflow-hidden flex-shrink-0">
            {row.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.author.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-brand">person</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="display text-base text-ink truncate">{row.author.name}</div>
            <div className="text-sm text-ink-muted">
              {row.author.role ? ROLE_LABEL[row.author.role] : '—'}
              {row.author.location && <> · {row.author.location}</>}
            </div>
          </div>
          {!isOwner && (
            <Link
              href={`/dashboard/messages/new?to=${row.author.id}&listing=${row.listing.id}`}
              className="px-4 py-2 text-sm bg-brand text-white rounded-xl hover:bg-brand-hover font-bold transition-colors"
            >
              Contacter
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
