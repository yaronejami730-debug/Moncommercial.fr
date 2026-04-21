import Link from 'next/link';
import { desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { conversations, messages, users } from '@/lib/db/schema';
import type { UserRole } from '@/lib/types';

const ROLE_LABEL: Record<UserRole, string> = {
  commercial: 'Commercial',
  regisseur: 'Régie',
  installateur: 'Installateur',
};

export default async function MessagesPage() {
  const me = await requireOnboarded();

  const other = alias(users, 'other');

  const rows = await db
    .select({
      conversationId: conversations.id,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
      otherId: other.id,
      otherName: other.name,
      otherAvatar: other.avatarUrl,
      otherRole: other.role,
    })
    .from(conversations)
    .innerJoin(
      other,
      or(
        sql`${other.id} = ${conversations.participant1Id} AND ${conversations.participant2Id} = ${me.id}`,
        sql`${other.id} = ${conversations.participant2Id} AND ${conversations.participant1Id} = ${me.id}`
      )
    )
    .orderBy(desc(sql`coalesce(${conversations.lastMessageAt}, ${conversations.createdAt})`))
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl text-ink">Messages</h1>
        <p className="text-ink-soft mt-2">Vos conversations.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-brand text-2xl">chat</span>
            </div>
            <p className="text-ink-soft">
              Aucune conversation. Lancez une discussion depuis la recherche ou une annonce.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((c) => (
              <li key={c.conversationId}>
                <Link
                  href={`/dashboard/messages/${c.conversationId}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-paper-tint transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center overflow-hidden flex-shrink-0">
                    {c.otherAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.otherAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-brand">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="display text-base text-ink truncate">{c.otherName}</div>
                    <div className="text-xs text-ink-muted mt-0.5">
                      {c.otherRole ? ROLE_LABEL[c.otherRole] : '—'} ·{' '}
                      {new Date(c.lastMessageAt ?? c.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-ink-faint">chevron_right</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
