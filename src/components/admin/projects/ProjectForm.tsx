"use client";

import { useState, type FormEvent } from "react";
import { useTransition } from "react";
import TechnologySelect from "./TechnologySelect";
import ImageDropzone from "./ImageDropzone";
import { slugify } from "@/lib/slugify";

type Technology = {
  id: number;
  name: string;
  skillBlockTitle: string;
};

type ExistingImage = {
  id: number;
  url: string;
};

type ProjectFormInitialData = {
  id: number;
  slug: string;
  titleFr: string;
  titleEn: string;
  categoryFr: string;
  categoryEn: string;
  descriptionFr: string;
  descriptionEn: string;
  demoUrl: string | null;
  codeUrl: string | null;
  featured: boolean;
  technologyIds: number[];
  images: ExistingImage[];
};

type ProjectFormProps = {
  mode: "create" | "edit";
  technologies: Technology[];
  initialData?: ProjectFormInitialData;
  onSubmitAction: (formData: FormData) => Promise<void>;
};

const CATEGORY_OPTIONS = [
  { fr: "GeoAI", en: "GeoAI" },
  { fr: "SIG", en: "GIS" },
  { fr: "Web", en: "Web" },
  { fr: "Mobile", en: "Mobile" },
  { fr: "Desktop", en: "Desktop" },
  { fr: "Télédétection", en: "Remote Sensing" },
];

export default function ProjectForm({
  mode,
  technologies,
  initialData,
  onSubmitAction,
}: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [categoryFr, setCategoryFr] = useState(
    initialData?.categoryFr ?? CATEGORY_OPTIONS[0].fr
  );
  const [descriptionFr, setDescriptionFr] = useState(
    initialData?.descriptionFr ?? ""
  );
  const [descriptionEn, setDescriptionEn] = useState(
    initialData?.descriptionEn ?? ""
  );
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl ?? "");
  const [codeUrl, setCodeUrl] = useState(initialData?.codeUrl ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [technologyIds, setTechnologyIds] = useState<number[]>(
    initialData?.technologyIds ?? []
  );

  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    initialData?.images ?? []
  );
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [error, setError] = useState("");

  const handleTitleFrChange = (value: string) => {
    setTitleFr(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleRemoveExistingImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setDeletedImageIds((prev) => [...prev, id]);
  };

  const handleSetCover = (id: number) => {
    setExistingImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (!target) return prev;
      return [target, ...prev.filter((img) => img.id !== id)];
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!titleFr.trim() || !titleEn.trim() || !slug.trim()) {
      setError("Merci de remplir au moins les titres FR/EN et le slug.");
      return;
    }

    const categoryEn =
      CATEGORY_OPTIONS.find((c) => c.fr === categoryFr)?.en ?? categoryFr;

    const formData = new FormData();
    formData.set("slug", slug.trim());
    formData.set("titleFr", titleFr.trim());
    formData.set("titleEn", titleEn.trim());
    formData.set("categoryFr", categoryFr);
    formData.set("categoryEn", categoryEn);
    formData.set("descriptionFr", descriptionFr);
    formData.set("descriptionEn", descriptionEn);
    formData.set("demoUrl", demoUrl.trim());
    formData.set("codeUrl", codeUrl.trim());
    formData.set("featured", featured ? "on" : "off");
    formData.set(
      "imageOrderIds",
      JSON.stringify(existingImages.map((img) => img.id))
    );
    technologyIds.forEach((id) =>
      formData.append("technologyIds", String(id))
    );
    deletedImageIds.forEach((id) =>
      formData.append("deleteImageIds", String(id))
    );
    newFiles.forEach((file) => formData.append("images", file));

    startTransition(async () => {
      try {
        await onSubmitAction(formData);
      } catch {
        setError(
          "Une erreur est survenue lors de l'enregistrement. Réessaie."
        );
      }
    });
  };

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";
  const labelClass = "block text-sm text-[#F4F6F8]/80 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Titres FR/EN */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Titre (FR)</label>
          <input
            type="text"
            value={titleFr}
            onChange={(e) => handleTitleFrChange(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Titre (EN)</label>
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>
          Slug (URL){" "}
          <span className="text-[#F4F6F8]/40 font-[var(--font-ibm-plex-mono)] text-xs">
            /projects/{slug || "..."}
          </span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          required
          className={inputClass}
        />
      </div>

      {/* Catégorie */}
      <div>
        <label className={labelClass}>Catégorie</label>
        <select
          value={categoryFr}
          onChange={(e) => setCategoryFr(e.target.value)}
          className={inputClass}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.fr} value={c.fr}>
              {c.fr}
            </option>
          ))}
        </select>
      </div>

      {/* Descriptions FR/EN */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Description (FR)</label>
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            rows={5}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Description (EN)</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={5}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Liens */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Lien démo (optionnel)</label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Lien code source (optionnel)</label>
          <input
            type="url"
            value={codeUrl}
            onChange={(e) => setCodeUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded accent-[#4DFFA0]"
        />
        <span className="text-sm text-[#F4F6F8]">
          Mettre en vedette (affiché en avant sur la page Projets)
        </span>
      </label>

      {/* Technologies */}
      <div>
        <label className={labelClass}>Technologies utilisées</label>
        <TechnologySelect
          technologies={technologies}
          selectedIds={technologyIds}
          onChange={setTechnologyIds}
        />
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Images du projet</label>
        <ImageDropzone
          existingImages={existingImages}
          onRemoveExisting={handleRemoveExistingImage}
          onSetCover={handleSetCover}
          newFiles={newFiles}
          onAddFiles={(files) => setNewFiles((prev) => [...prev, ...files])}
          onRemoveNewFile={(index) =>
            setNewFiles((prev) => prev.filter((_, i) => i !== index))
          }
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 font-[var(--font-ibm-plex-mono)]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending
            ? "Enregistrement..."
            : mode === "create"
              ? "Créer le projet"
              : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}