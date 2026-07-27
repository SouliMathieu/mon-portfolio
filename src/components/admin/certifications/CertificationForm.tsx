"use client";

import { useState, useRef, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { Upload, FileText } from "lucide-react";

type CertificationFormProps = {
  mode: "create" | "edit";
  initialData?: {
    titleFr: string;
    titleEn: string;
    issuer: string;
    date: string; // format yyyy-mm-dd pour <input type="date">
    url: string;
    fileUrl: string | null;
  };
  onSubmitAction: (formData: FormData) => Promise<void>;
};

function isPdf(url: string | null) {
  return !!url && url.toLowerCase().endsWith(".pdf");
}

export default function CertificationForm({
  mode,
  initialData,
  onSubmitAction,
}: CertificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [issuer, setIssuer] = useState(initialData?.issuer ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");

  const [existingFileUrl, setExistingFileUrl] = useState(
    initialData?.fileUrl ?? null
  );
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";
  const labelClass = "block text-sm text-[#F4F6F8]/80 mb-1.5";

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setNewFile(file);
    setRemoveFile(false);
  };

  const handleRemoveFile = () => {
    setExistingFileUrl(null);
    setNewFile(null);
    setRemoveFile(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!titleFr.trim() || !titleEn.trim() || !issuer.trim() || !date) {
      setError(
        "Merci de remplir au moins les titres, l'organisme et la date."
      );
      return;
    }

    const formData = new FormData();
    formData.set("titleFr", titleFr.trim());
    formData.set("titleEn", titleEn.trim());
    formData.set("issuer", issuer.trim());
    formData.set("date", date);
    formData.set("url", url.trim());
    formData.set("removeFile", removeFile ? "on" : "off");
    if (newFile) formData.set("file", newFile);

    startTransition(async () => {
      try {
        await onSubmitAction(formData);
      } catch {
        setError("Une erreur est survenue lors de l'enregistrement.");
      }
    });
  };

  const hasFile = !!newFile || !!existingFileUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Titre (FR)</label>
          <input
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            placeholder="Certification AWS Cloud Practitioner"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Titre (EN)</label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="AWS Cloud Practitioner Certification"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Organisme</label>
        <input
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          placeholder="ex: Amazon Web Services, Google, ESA..."
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date d&apos;obtention</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Lien de vérification (optionnel)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://credly.com/..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Fichier du certificat (image ou PDF) */}
      <div>
        <label className={labelClass}>
          Fichier du certificat (image ou PDF, optionnel)
        </label>

        {hasFile ? (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative">
              {newFile ? (
                newFile.type === "application/pdf" ? (
                  <FileText size={22} className="text-[#F4F6F8]/50" />
                ) : (
                  // Prévisualisation locale avant upload : <img> natif nécessaire pour les blob URLs
                  <img
                    src={URL.createObjectURL(newFile)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )
              ) : isPdf(existingFileUrl) ? (
                <FileText size={22} className="text-[#F4F6F8]/50" />
              ) : (
                <Image
                  src={existingFileUrl as string}
                  alt=""
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F4F6F8] hover:bg-white/10 transition-colors w-fit"
              >
                <Upload size={12} />
                Remplacer
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs text-red-400 hover:text-red-300 transition-colors text-left"
              >
                Retirer le fichier
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F4F6F8] hover:bg-white/10 transition-colors"
          >
            <Upload size={14} />
            Choisir un fichier (image ou PDF)
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
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