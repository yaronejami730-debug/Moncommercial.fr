import Link from 'next/link';
import { requireOnboarded } from '@/lib/auth';
import ProfileForm from './form';
import type { UserRole } from '@/lib/types';

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

export default async function ProfilePage() {
  const user = await requireOnboarded();
  const specialties = user.specialties ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="display text-3xl text-ink">Mon profil</h1>
          <p className="text-ink-soft mt-2">
            Informations visibles par les commerciaux, régies et installateurs.
          </p>
        </div>
        <Link
          href={`/dashboard/users/${user.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white border border-line rounded-xl hover:border-brand hover:text-brand transition-colors"
        >
          <span className="material-symbols-outlined text-base">visibility</span>
          Voir mon profil public
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-card border border-line p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-brand-soft rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-brand">person</span>
                )}
              </div>
              <h2 className="display text-lg text-ink">{user.name}</h2>
              <p className="text-ink-muted text-sm break-all">{user.email}</p>
              {user.role && (
                <div
                  className={`mt-3 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ROLE_STYLE[user.role]}`}
                >
                  {ROLE_LABEL[user.role]}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-line space-y-2 text-sm">
              {user.phone && (
                <div className="flex items-center gap-2 text-ink-soft">
                  <span className="material-symbols-outlined text-base text-ink-muted">call</span>
                  {user.phone}
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2 text-ink-soft">
                  <span className="material-symbols-outlined text-base text-ink-muted">location_on</span>
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2 text-ink-soft truncate">
                  <span className="material-symbols-outlined text-base text-ink-muted">link</span>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand truncate"
                  >
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {specialties.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card border border-line p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-3">
                Métiers affichés ({specialties.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-soft text-brand"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-card border border-line p-6">
          <ProfileForm
            user={{
              name: user.name,
              phone: user.phone ?? '',
              location: user.location ?? '',
              website: user.website ?? '',
              bio: user.bio ?? '',
              avatarUrl: user.avatarUrl ?? '',
              specialties,
              email: user.email,
              role: user.role,
            }}
          />
        </div>
      </div>
    </div>
  );
}
