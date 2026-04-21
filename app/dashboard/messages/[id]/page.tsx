import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { requireOnboarded } from '@/lib/auth';
import { db } from '@/lib/db';
import { conversations, messages, users } from '@/lib/db/schema';
import { isParticipant } from '@/lib/conversations';
import type { UserRole } from '@/lib/types';
import MessageComposer from './composer';

const ROLE_LABEL: Record<UserRole, string> = {
  commercial: 'Commercial',
  regisseur: 'Régie',
  installateur: 'Installateur',
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireOnboarded();

  const conv = await db.query.conversations.findFirst({
    where: eq(conversations.id, id),
  });
  if (!conv) notFound();
  if (!isParticipant(conv, me.id)) redirect('/dashboard/messages');

  const otherId =
    conv.participant1Id === me.id ? conv.participant2Id : conv.participant1Id;
  const other = await db.query.users.findFirst({ where: eq(users.id, otherId) });
  if (!other) notFound();

  const thread = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conv.id))
    .orderBy(asc(messages.createdAt));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-line">
        <Link
          href="/dashboard/messages"
          className="text-ink-muted hover:text-ink inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-paper-tint transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center overflow-hidden flex-shrink-0">
          {other.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={other.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-brand">person</span>
          )}
        </div>
        <div>
          <div className="display text-base text-ink">{other.name}</div>
          <div className="text-xs text-ink-muted">
            {other.role ? ROLE_LABEL[other.role] : '—'} {other.location && <>· {other.location}</>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4 space-y-3">
        {thread.length === 0 ? (
          <p className="text-center text-sm text-ink-muted py-10">
            Commencez la conversation.
          </p>
        ) : (
          thread.map((m) => {
            const mine = m.senderId === me.id;
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-white border border-line text-ink rounded-bl-sm shadow-card'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  <div className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-ink-faint'}`}>
                    {new Date(m.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageComposer conversationId={conv.id} />
    </div>
  );
}
