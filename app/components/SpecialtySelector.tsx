'use client';

import { useMemo, useState } from 'react';
import { SPECIALTY_CATALOG } from '@/lib/specialties';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  title?: string;
  description?: string;
};

export default function SpecialtySelector({
  value,
  onChange,
  title = 'Métiers & spécialités',
  description = 'Cochez tous les métiers que vous exercez. Les régies et installateurs verront exactement ce que vous avez sélectionné.',
}: Props) {
  const [query, setQuery] = useState('');
  const [openCat, setOpenCat] = useState<string | null>(SPECIALTY_CATALOG[0]?.key ?? null);

  const toggle = (s: string) => {
    const set = new Set(value);
    if (set.has(s)) set.delete(s);
    else set.add(s);
    onChange(Array.from(set));
  };

  const remove = (s: string) => {
    onChange(value.filter((v) => v !== s));
  };

  const clearAll = () => onChange([]);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return SPECIALTY_CATALOG;
    return SPECIALTY_CATALOG.map((cat) => ({
      ...cat,
      groups: cat.groups
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (it) =>
              it.toLowerCase().includes(q) ||
              g.label.toLowerCase().includes(q) ||
              cat.label.toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.items.length > 0),
    })).filter((cat) => cat.groups.length > 0);
  }, [q]);

  const totalMatches = filtered.reduce(
    (n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="display text-lg text-ink">{title}</h3>
          <p className="text-sm text-ink-soft mt-0.5">{description}</p>
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-brand bg-brand-soft px-3 py-1.5 rounded-full">
          {value.length} métier{value.length > 1 ? 's' : ''} sélectionné{value.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-xl pointer-events-none">
          search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un métier ou une spécialité (ex : pompe à chaleur, commercial, MaPrimeRénov')…"
          className="w-full pl-10 pr-10 py-3 border border-line rounded-xl text-sm text-ink bg-white placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
            aria-label="Effacer la recherche"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
        {query && (
          <p className="text-xs text-ink-muted mt-1.5 pl-1">
            {totalMatches} résultat{totalMatches > 1 ? 's' : ''} pour « {query} »
          </p>
        )}
      </div>

      {/* Selected summary */}
      {value.length > 0 && (
        <div className="bg-brand-soft/60 border border-brand/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-brand">
              Votre sélection — visible sur votre profil
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-semibold text-ink-soft hover:text-brand underline"
            >
              Tout effacer
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {value.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 bg-white text-ink text-xs font-semibold px-2.5 py-1 rounded-full border border-brand/30"
              >
                {s}
                <button
                  type="button"
                  onClick={() => remove(s)}
                  className="text-ink-muted hover:text-brand"
                  aria-label={`Retirer ${s}`}
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Catalog */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-8 bg-paper-tint rounded-xl">
            Aucun métier trouvé. Essayez un autre mot-clé.
          </p>
        )}

        {filtered.map((cat) => {
          const isOpen = q ? true : openCat === cat.key;
          const catSelectedCount = value.filter((v) =>
            cat.groups.some((g) => g.items.includes(v))
          ).length;
          const totalInCat = cat.groups.reduce((n, g) => n + g.items.length, 0);

          return (
            <div
              key={cat.key}
              className="bg-white border border-line rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenCat(isOpen ? null : cat.key)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper-tint transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="display text-sm text-ink truncate">{cat.label}</p>
                    <p className="text-[11px] text-ink-muted">
                      {totalInCat} métiers
                      {catSelectedCount > 0 && (
                        <span className="text-brand font-bold"> · {catSelectedCount} coché{catSelectedCount > 1 ? 's' : ''}</span>
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-ink-muted transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-line px-4 py-4 space-y-4 bg-paper-warm/30">
                  {cat.groups.map((g) => (
                    <div key={g.label}>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-2">
                        {g.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((s) => {
                          const active = value.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggle(s)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                                active
                                  ? 'bg-brand text-white border-brand shadow-sm'
                                  : 'bg-white text-ink-soft border-line hover:border-brand hover:text-brand'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {active ? 'check_circle' : 'add_circle'}
                              </span>
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
