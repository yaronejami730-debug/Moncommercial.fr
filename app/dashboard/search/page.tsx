import { and, desc, eq, ilike, ne, sql, SQL } from 'drizzle-orm';
import Link from 'next/link';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import type { UserRole } from '@/lib/types';
import SearchFilters from './filters';

const ROLES: UserRole[] = ['commercial', 'regisseur', 'installateur'];
const ROLE_LABEL: Record<UserRole, string> = {
  commercial: 'Commercial',
  regisseur: 'Régie',
  installateur: 'Installateur',
};
const ROLE_STYLE: Record<UserRole, string> = {
  commercial: 'bg-star/10 text-star',
  regisseur: 'bg-brand-soft text-brand',
  installateur: 'bg-verify-soft text-verify',
};

type SearchParams = Promise<{
  role?: string;
  location?: string;
  specialty?: string;
  q?: string;
}>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const me = await requireOnboarded();
  const { role, location, specialty, q } = await searchParams;

  const filters: SQL[] = [ne(users.id, me.id), eq(users.onboardingCompleted, true)];

  if (role && ROLES.includes(role as UserRole)) {
    filters.push(eq(users.role, role as UserRole));
  }
  if (location) filters.push(ilike(users.location, `%${location}%`));
  if (q) filters.push(ilike(users.name, `%${q}%`));
  if (specialty) {
    filters.push(sql`${users.specialties} @> ${JSON.stringify([specialty])}::jsonb`);
  }

  const results = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      location: users.location,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      specialties: users.specialties,
    })
    .from(users)
    .where(and(...filters))
    .orderBy(desc(users.createdAt))
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl text-ink">Recherche</h1>
        <p className="text-ink-soft mt-2">
          Trouvez des installateurs, régies ou commerciaux.
        </p>
      </div>

      <SearchFilters />

      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="border-b border-line px-6 py-3 text-sm text-ink-soft font-semibold">
          {results.length} résultat{results.length > 1 ? 's' : ''}
        </div>
        <ul className="divide-y divide-line">
          {results.length === 0 && (
            <li className="px-6 py-12 text-center text-ink-muted">
              Aucun résultat. Essayez d&apos;élargir vos filtres.
            </li>
          )}
          {results.map((u) => (
            <li key={u.id} className="px-6 py-4 flex items-center gap-4 hover:bg-paper-tint transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center overflow-hidden flex-shrink-0">
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-brand">person</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="display text-base text-ink truncate">{u.name}</h3>
                  {u.role && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ROLE_STYLE[u.role]}`}>
                      {ROLE_LABEL[u.role]}
                    </span>
                  )}
                  {u.location && (
                    <span className="text-xs text-ink-muted">· {u.location}</span>
                  )}
                </div>
                {u.bio && <p className="text-sm text-ink-soft mt-0.5 line-clamp-2">{u.bio}</p>}
                {u.specialties && u.specialties.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {u.specialties.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full bg-paper-tint text-ink-soft font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href={`/dashboard/messages/new?to=${u.id}`}
                className="px-4 py-2 text-sm font-bold bg-brand text-white rounded-xl hover:bg-brand-hover transition-colors"
              >
                Contacter
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
