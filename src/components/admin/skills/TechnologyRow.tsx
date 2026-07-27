"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import {
  updateTechnology,
  deleteTechnology,
} from "@/app/admin/(protected)/skills/actions";

type TechnologyRowProps = {
  technology: {
    id: number;
    name: string;
    level: number;
  };
};

export default function TechnologyRow({ technology }: TechnologyRowProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState(technology.name);
  const [level, setLevel] = useState(technology.level);

  const handleSave = () => {
    setError("");
    const formData = new FormData();
    formData.set("name", name);
    formData.set("level", String(level));

    startTransition(async () => {
      try {
        await updateTechnology(technology.id, formData);
        setEditing(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de l'enregistrement."
        );
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTechnology(technology.id);
    });
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 flex-wrap">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[120px] rounded-md bg-white/5 border border-white/10 px-2 py-1 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0]"
        />
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0]"
        >
          {[1, 2, 3, 4, 5].map((lvl) => (
            <option key={lvl} value={lvl}>
              Niveau {lvl}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="p-1.5 rounded-md bg-[#4DFFA0]/20 hover:bg-[#4DFFA0]/30 text-[#4DFFA0] transition-colors"
          aria-label="Enregistrer"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setName(technology.name);
            setLevel(technology.level);
            setError("");
          }}
          className="p-1.5 rounded-md text-[#F4F6F8]/60 hover:bg-white/10 transition-colors"
          aria-label="Annuler"
        >
          <X size={14} />
        </button>
        {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#F4F6F8]">{technology.name}</span>
        <span className="text-xs text-[#4DFFA0] font-[var(--font-ibm-plex-mono)]">
          Niveau {technology.level}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-md text-[#F4F6F8]/50 hover:bg-white/5 hover:text-[#F4F6F8] transition-colors"
          aria-label="Modifier"
        >
          <Pencil size={14} />
        </button>

        {confirmingDelete ? (
          <>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              aria-label="Confirmer la suppression"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="p-1.5 rounded-md text-[#F4F6F8]/60 hover:bg-white/10 transition-colors"
              aria-label="Annuler"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="p-1.5 rounded-md text-[#F4F6F8]/50 hover:bg-white/5 hover:text-red-400 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}