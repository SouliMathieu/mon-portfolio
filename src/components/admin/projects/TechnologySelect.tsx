"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";

type Technology = {
  id: number;
  name: string;
  skillBlockTitle: string;
};

type TechnologySelectProps = {
  technologies: Technology[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
};

export default function TechnologySelect({
  technologies,
  selectedIds,
  onChange,
}: TechnologySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = technologies.filter((t) => selectedIds.includes(t.id));

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return technologies.filter(
      (t) => !selectedIds.includes(t.id) && t.name.toLowerCase().includes(q)
    );
  }, [query, technologies, selectedIds]);

  const addTech = (id: number) => {
    onChange([...selectedIds, id]);
    setQuery("");
  };

  const removeTech = (id: number) => {
    onChange(selectedIds.filter((sid) => sid !== id));
  };

  return (
    <div className="relative">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((tech) => (
            <span
              key={tech.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4DFFA0]/10 text-[#4DFFA0] text-xs"
            >
              {tech.name}
              <button
                type="button"
                onClick={() => removeTech(tech.id)}
                className="hover:text-red-400 transition-colors"
                aria-label={`Retirer ${tech.name}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Rechercher une technologie..."
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors"
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-[#1B2838] shadow-2xl">
          {filtered.map((tech) => (
            <button
              key={tech.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTech(tech.id)}
              className="w-full text-left px-3 py-2 text-sm text-[#F4F6F8] hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              {tech.name}
              <span className="text-xs text-[#F4F6F8]/40 font-[var(--font-ibm-plex-mono)]">
                {tech.skillBlockTitle}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}