"use client";

import { useState, useRef, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { Plus, X, Upload, User, FileText, ExternalLink } from "lucide-react";
import { updateAboutContent } from "@/app/admin/(protected)/about/actions";

type HighlightItem = { title: string; period: string; description: string };

type HighlightRow = {
  titleFr: string;
  periodFr: string;
  descriptionFr: string;
  titleEn: string;
  periodEn: string;
  descriptionEn: string;
};

type AboutFormProps = {
  initialData: {
    titleFr: string;
    titleEn: string;
    bioFr: string;
    bioEn: string;
    highlightsFr: HighlightItem[];
    highlightsEn: HighlightItem[];
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
    photoUrl: string | null;
    hasCvFr: boolean;
    hasCvEn: boolean;
  };
};

const emptyRow: HighlightRow = {
  titleFr: "",
  periodFr: "",
  descriptionFr: "",
  titleEn: "",
  periodEn: "",
  descriptionEn: "",
};

function CvUploadField({
  label,
  hasFile,
  fileUrl,
  file,
  onChange,
}: {
  label: string;
  hasFile: boolean;
  fileUrl: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className="text-xs text-[#F4F6F8]/50 mb-1 block">{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex-1 min-w-0">
          <FileText size={16} className="text-[#4DFFA0] shrink-0" />
          <span className="text-sm text-[#F4F6F8] truncate">
            {file ? file.name : hasFile ? "Fichier actuel" : "Aucun fichier"}
          </span>
        </div>

        {hasFile && !file && (
          <a
            href={`${fileUrl}?t=${Date.now()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-[#F4F6F8]/60 hover:bg-white/5 hover:text-[#F4F6F8] transition-colors shrink-0"
            aria-label="Voir le fichier actuel"
          >
            <ExternalLink size={16} />
          </a>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F4F6F8] hover:bg-white/10 transition-colors shrink-0"
        >
          <Upload size={12} />
          {hasFile || file ? "Remplacer" : "Ajouter"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

export default function AboutForm({ initialData }: AboutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [titleFr, setTitleFr] = useState(initialData.titleFr);
  const [titleEn, setTitleEn] = useState(initialData.titleEn);
  const [bioFr, setBioFr] = useState(initialData.bioFr);
  const [bioEn, setBioEn] = useState(initialData.bioEn);

  const initialRows: HighlightRow[] = initialData.highlightsFr.map(
    (fr, i) => {
      const en = initialData.highlightsEn[i] ?? {
        title: "",
        period: "",
        description: "",
      };
      return {
        titleFr: fr.title,
        periodFr: fr.period,
        descriptionFr: fr.description,
        titleEn: en.title,
        periodEn: en.period,
        descriptionEn: en.description,
      };
    }
  );

  const [highlights, setHighlights] = useState<HighlightRow[]>(
    initialRows.length > 0 ? initialRows : [{ ...emptyRow }]
  );

  const [email, setEmail] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone);
  const [linkedin, setLinkedin] = useState(initialData.linkedin);
  const [github, setGithub] = useState(initialData.github);
  const [location, setLocation] = useState(initialData.location);

  const [photoUrl, setPhotoUrl] = useState(initialData.photoUrl);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cvFrFile, setCvFrFile] = useState<File | null>(null);
  const [cvEnFile, setCvEnFile] = useState<File | null>(null);

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";
  const labelClass = "block text-sm text-[#F4F6F8]/80 mb-1.5";
  const miniLabelClass = "text-xs text-[#F4F6F8]/50 mb-1 block";

  const updateHighlight = (
    index: number,
    field: keyof HighlightRow,
    value: string
  ) => {
    setHighlights((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const addHighlight = () => {
    setHighlights((prev) => [...prev, { ...emptyRow }]);
  };

  const removeHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (file: File | null) => {
    if (!file) return;
    setNewPhoto(file);
    setRemovePhoto(false);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setNewPhoto(null);
    setRemovePhoto(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    const validRows = highlights.filter(
      (h) =>
        h.titleFr.trim() ||
        h.titleEn.trim() ||
        h.descriptionFr.trim() ||
        h.descriptionEn.trim()
    );

    const highlightsFr = validRows.map((h) => ({
      title: h.titleFr,
      period: h.periodFr,
      description: h.descriptionFr,
    }));
    const highlightsEn = validRows.map((h) => ({
      title: h.titleEn,
      period: h.periodEn,
      description: h.descriptionEn,
    }));

    const formData = new FormData();
    formData.set("titleFr", titleFr);
    formData.set("titleEn", titleEn);
    formData.set("bioFr", bioFr);
    formData.set("bioEn", bioEn);
    formData.set("highlightsFr", JSON.stringify(highlightsFr));
    formData.set("highlightsEn", JSON.stringify(highlightsEn));
    formData.set("email", email);
    formData.set("phone", phone);
    formData.set("linkedin", linkedin);
    formData.set("github", github);
    formData.set("location", location);
    formData.set("removePhoto", removePhoto ? "on" : "off");
    if (newPhoto) formData.set("photo", newPhoto);
    if (cvFrFile) formData.set("cvFr", cvFrFile);
    if (cvEnFile) formData.set("cvEn", cvEnFile);

    startTransition(async () => {
      try {
        await updateAboutContent(formData);
        setSaved(true);
        setNewPhoto(null);
        setRemovePhoto(false);
        setCvFrFile(null);
        setCvEnFile(null);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        setError("Une erreur est survenue lors de l'enregistrement.");
      }
    });
  };

  const previewSrc = newPhoto ? URL.createObjectURL(newPhoto) : photoUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Photo */}
      <div>
        <label className={labelClass}>Photo de profil</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center relative shrink-0">
            {previewSrc ? (
              newPhoto ? (
                <img
                  src={previewSrc}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image src={previewSrc} alt="" fill className="object-cover" />
              )
            ) : (
              <User size={28} className="text-[#F4F6F8]/30" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F4F6F8] hover:bg-white/10 transition-colors"
            >
              <Upload size={14} />
              {previewSrc ? "Remplacer" : "Choisir une photo"}
            </button>
            {previewSrc && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Retirer la photo
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
      </div>

      {/* CV */}
      <div>
        <label className={labelClass}>CV téléchargeable</label>
        <div className="space-y-3">
          <CvUploadField
            label="CV (FR)"
            hasFile={initialData.hasCvFr}
            fileUrl="/documents/cv-fr.pdf"
            file={cvFrFile}
            onChange={setCvFrFile}
          />
          <CvUploadField
            label="CV (EN)"
            hasFile={initialData.hasCvEn}
            fileUrl="/documents/cv-en.pdf"
            file={cvEnFile}
            onChange={setCvEnFile}
          />
        </div>
        <p className="text-xs text-[#F4F6F8]/40 mt-2">
          Le bouton &quot;Télécharger CV&quot; du site public pointe toujours
          vers ces mêmes fichiers — inutile de toucher au code après un
          remplacement.
        </p>
      </div>

      {/* Titre de la page */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Titre de la page (FR)</label>
          <input
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            placeholder="À propos de moi"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Titre de la page (EN)</label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="About Me"
            className={inputClass}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Biographie (FR)</label>
          <textarea
            value={bioFr}
            onChange={(e) => setBioFr(e.target.value)}
            rows={8}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Biographie (EN)</label>
          <textarea
            value={bioEn}
            onChange={(e) => setBioEn(e.target.value)}
            rows={8}
            className={inputClass}
          />
        </div>
      </div>

      {/* Highlights */}
      <div>
        <label className={labelClass}>
          Temps forts (carrousel &quot;highlights&quot;)
        </label>

        <div className="space-y-4">
          {highlights.map((h, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#F4F6F8]/40 font-[var(--font-ibm-plex-mono)]">
                  Temps fort #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="p-1.5 rounded-md text-[#F4F6F8]/50 hover:bg-white/5 hover:text-red-400 transition-colors"
                  aria-label="Retirer ce temps fort"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className={miniLabelClass}>Titre (FR)</span>
                    <input
                      value={h.titleFr}
                      onChange={(e) =>
                        updateHighlight(index, "titleFr", e.target.value)
                      }
                      placeholder="Hackathon UNESCO 2026"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <span className={miniLabelClass}>Période (FR)</span>
                    <input
                      value={h.periodFr}
                      onChange={(e) =>
                        updateHighlight(index, "periodFr", e.target.value)
                      }
                      placeholder="Février 2026"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <span className={miniLabelClass}>Description (FR)</span>
                    <textarea
                      value={h.descriptionFr}
                      onChange={(e) =>
                        updateHighlight(index, "descriptionFr", e.target.value)
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className={miniLabelClass}>Titre (EN)</span>
                    <input
                      value={h.titleEn}
                      onChange={(e) =>
                        updateHighlight(index, "titleEn", e.target.value)
                      }
                      placeholder="UNESCO 2026 Hackathon"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <span className={miniLabelClass}>Period (EN)</span>
                    <input
                      value={h.periodEn}
                      onChange={(e) =>
                        updateHighlight(index, "periodEn", e.target.value)
                      }
                      placeholder="February 2026"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <span className={miniLabelClass}>Description (EN)</span>
                    <textarea
                      value={h.descriptionEn}
                      onChange={(e) =>
                        updateHighlight(index, "descriptionEn", e.target.value)
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addHighlight}
          className="flex items-center gap-1.5 mt-3 text-xs text-[#4DFFA0] hover:opacity-80 transition-opacity"
        >
          <Plus size={14} />
          Ajouter un temps fort
        </button>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Téléphone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>GitHub</label>
          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Localisation</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 font-[var(--font-ibm-plex-mono)]">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-sm text-[#4DFFA0] font-[var(--font-ibm-plex-mono)]">
          Enregistré ✓
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}