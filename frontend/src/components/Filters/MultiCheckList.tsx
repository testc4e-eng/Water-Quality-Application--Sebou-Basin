import React, { useMemo, useState } from "react";
import { Search, CheckSquare, Square } from "lucide-react";

export type MultiCheckItem = { id: string; label: string };

type Props = {
  /** Titre affiché au-dessus de la liste */
  title?: string;
  /** Tableau d’items { id, label } */
  items: MultiCheckItem[];
  /** Dictionnaire de sélection: { [id]: true } */
  value: Record<string, boolean>;
  /** Callback with the next map after change */
  onChange: (next: Record<string, boolean>) => void;
  /** Hauteur du panneau scrollable */
  height?: number;
  /** Placeholder de la barre de recherche */
  searchPlaceholder?: string;
};

export default function MultiCheckList({
  title,
  items,
  value,
  onChange,
  height = 180,
  searchPlaceholder = "Rechercher…",
}: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(qq) || it.id.toLowerCase().includes(qq)
    );
  }, [items, q]);

  const allSelected = useMemo(() => {
    if (!filtered.length) return false;
    return filtered.every((it) => value[it.id]);
  }, [filtered, value]);

  const indeterminate = useMemo(() => {
    if (!filtered.length) return false;
    const some = filtered.some((it) => value[it.id]);
    return some && !allSelected;
  }, [filtered, value, allSelected]);

  const toggleOne = (id: string, checked: boolean) => {
    const next = { ...value };
    if (checked) next[id] = true;
    else delete next[id];
    onChange(next);
  };

  const selectAll = () => {
    const next = { ...value };
    filtered.forEach((it) => (next[it.id] = true));
    onChange(next);
  };

  const clearAll = () => {
    // ne vide que les éléments visibles pour garder les autres sélections éventuelles
    const next = { ...value };
    filtered.forEach((it) => {
      if (next[it.id]) delete next[it.id];
    });
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {title && <div className="font-medium text-primary">{title}</div>}

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-2 top-2 text-muted-foreground" />
          <input
            className="w-full rounded-md border px-7 py-1 text-sm"
            placeholder={searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Select / clear all */}
        <button
          type="button"
          className="px-2 py-1 text-xs rounded-md border hover:bg-accent"
          onClick={allSelected ? clearAll : selectAll}
          title={allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        >
          {allSelected ? (
            <Square className="h-4 w-4" />
          ) : (
            <CheckSquare className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Counters */}
      <div className="text-xs text-muted-foreground">
        {Object.keys(value).length} sélectionné(s)
        {q
          ? ` • ${filtered.length}/${items.length} visibles`
          : ` • ${items.length} items`}
        {indeterminate ? " • (partiel)" : ""}
      </div>

      {/* Scrollable list */}
      <div
        className="rounded-md border p-2 space-y-1 overflow-auto"
        style={{ maxHeight: height }}
      >
        {filtered.map((it) => {
          const checked = !!value[it.id];
          return (
            <label key={it.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => toggleOne(it.id, e.target.checked)}
              />
              <span className="truncate" title={it.label}>
                {it.label}
              </span>
            </label>
          );
        })}
        {!filtered.length && (
          <div className="text-xs text-muted-foreground px-1 py-2">
            Aucun résultat
          </div>
        )}
      </div>
    </div>
  );
}
