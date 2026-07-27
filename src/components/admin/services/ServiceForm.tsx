"use client";

import { useState, useTransition, type FormEvent } from "react";

type ServiceFormProps = {
  mode: "create" | "edit";
  initialData?: {
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
  };
  onSubmitAction: (formData: FormData) => Promise<void>;
};

export default function ServiceForm({
  mode,
  initialData,
  onSubmitAction,
}: ServiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [descriptionFr, setDescriptionFr] = useState(
    initialData?.descriptionFr ?? ""
  );
  const [descriptionEn, setDescriptionEn] = useState(
    initialData?.descriptionEn ?? ""
  );

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";
  const labelClass = "block text-sm text-[#F4F6F8]/80 mb-1.5";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !titleFr.trim() ||
      !titleEn.trim() ||
      !descriptionFr.trim() ||
      !descriptionEn.trim()
    ) {
      setError("Merci de remplir tous les champs (FR et EN).");
      return;
    }

    const formData = new FormData();
    formData.set("titleFr", titleFr.trim());
    formData.set("titleEn", titleEn.trim());
    formData.set("descriptionFr", descriptionFr.trim());
    formData.set("descriptionEn", descriptionEn.trim());

    startTransition(async () => {
      try {
        await onSubmitAction(formData);
      } catch {
        setError("Une erreur est survenue lors de l'enregistrement.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Titre (FR)</label>
          <input
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            placeholder="Développement web full stack"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Titre (EN)</label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Full-stack web development"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Description (FR)</label>
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            rows={4}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Description (EN)</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={4}
            required
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 font-[var(--font-ibm-plex-mono)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending
          ? "Enregistrement..."
          : mode === "create"
            ? "Créer"
            : "Enregistrer"}
      </button>
    </form>
  );
}