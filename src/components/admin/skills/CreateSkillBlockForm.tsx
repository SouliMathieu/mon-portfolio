"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createSkillBlock } from "@/app/admin/(protected)/skills/actions";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export default function CreateSkillBlockForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [titleFr, setTitleFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [descriptionFr, setDescriptionFr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";

  const resetForm = () => {
    setTitleFr("");
    setTitleEn("");
    setSlug("");
    setSlugTouched(false);
    setDescriptionFr("");
    setDescriptionEn("");
    setError("");
  };

  const handleTitleFrChange = (value: string) => {
    setTitleFr(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCreate = () => {
    setError("");

    if (!titleFr.trim() || !titleEn.trim() || !slug.trim()) {
      setError("Slug, titre FR et titre EN sont requis.");
      return;
    }

    const formData = new FormData();
    formData.set("slug", slug.trim());
    formData.set("titleFr", titleFr.trim());
    formData.set("titleEn", titleEn.trim());
    formData.set("descriptionFr", descriptionFr);
    formData.set("descriptionEn", descriptionEn);

    startTransition(async () => {
      try {
        await createSkillBlock(formData);
        resetForm();
        setOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la création."
        );
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-4 text-xs text-[#F4F6F8]/60 transition-colors hover:border-[#4DFFA0]/40 hover:text-[#4DFFA0]"
      >
        <Plus size={14} />
        Nouveau bloc
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-6 space-y-3">
        <p className="text-sm text-[#F4F6F8]/80 font-medium mb-1">
          Nouveau bloc de compétences
        </p>

        <div className="grid grid-cols-2 gap-3">
          <input
            value={titleFr}
            onChange={(e) => handleTitleFrChange(e.target.value)}
            placeholder="Titre FR"
            className={inputClass}
          />
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Titre EN"
            className={inputClass}
          />
        </div>

        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="slug (généré automatiquement, modifiable)"
          className={`${inputClass} font-[var(--font-ibm-plex-mono)] text-xs`}
        />

        <div className="grid grid-cols-2 gap-3">
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            placeholder="Description FR"
            rows={3}
            className={inputClass}
          />
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="Description EN"
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending}
            className="px-4 py-2 rounded-full bg-[#4DFFA0] text-[#1B2838] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Créer le bloc
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
            className="px-4 py-2 rounded-full text-xs text-[#F4F6F8]/60 hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 font-[var(--font-ibm-plex-mono)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}