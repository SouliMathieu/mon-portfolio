'use client';

import type { ReactNode } from 'react';

type Props = {
  categories: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  allLabel: string;
};

export default function CategoryFilter({ categories, selected, onSelect, allLabel }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill active={selected === null} onClick={() => onSelect(null)}>
        {allLabel}
      </FilterPill>
      {categories.map((cat) => (
        <FilterPill key={cat} active={selected === cat} onClick={() => onSelect(cat)}>
          {cat}
        </FilterPill>
      ))}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DFFA0]/50 ${
        active
          ? 'border-[#4DFFA0] bg-[#4DFFA0]/10 text-[#4DFFA0]'
          : 'border-white/10 text-[#F4F6F8]/60 hover:border-white/25 hover:text-[#F4F6F8]'
      }`}
    >
      {children}
    </button>
  );
}