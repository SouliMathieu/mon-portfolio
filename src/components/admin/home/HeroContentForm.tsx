"use client";

import { useState, useTransition } from "react";
import { updateHeroContent } from "@/app/admin/(protected)/home/actions";

type HeroContent = {
  roleFr: string;
  roleEn: string;
  taglineFr: string;
  taglineEn: string;
  descriptionFr: string;
  descriptionEn: string;
} | null;

type Props = {
  heroContent: HeroContent;
};

export default function HeroContentForm({ heroContent }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [roleFr, setRoleFr] = useState(heroContent?.roleFr ?? "");
  const [roleEn, setRoleEn] = useState(heroContent?.roleEn ?? "");
  const [taglineFr, setTaglineFr] = useState(heroContent?.taglineFr ?? "");
  const [taglineEn, setTaglineEn] = useState(heroContent?.taglineEn ?? "");
  const [descriptionFr, setDescriptionFr] = useState(
    heroContent?.descriptionFr ?? ""
  );
  const [descriptionEn, setDescriptionEn] = useState(
    heroContent?.descriptionEn ?? ""
  );

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";
  const labelClass =
    "text-xs text-[#F4F6F8]/50 font-[var(--font-ibm-plex-mono)] mb-1 block";

  const handleSave = () => {
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.set("roleFr", roleFr);
    formData.set("roleEn", roleEn);
    formData.set("taglineFr", taglineFr);
    formData.set("taglineEn", taglineEn);
    formData.set("descriptionFr", descriptionFr);
    formData.set("descriptionEn", descriptionEn);

    startTransition(async () => {
      try {
        await updateHeroContent(formData);
        setSuccess(true);
      } catch {
        setError("Erreur lors de l'enregistrement.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 space-y-6 max-w-3xl">
      <div>
        <p className="text-sm text-[#F4F6F8]/80 font-medium mb-3">
          Rôle / poste (sous le nom — ex. &quot;Ingénieur en
          Géoinformation&quot;)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>FR</label>
            <input
              value={roleFr}
              onChange={(e) => setRoleFr(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>EN</label>
            <input
              value={roleEn}
              onChange={(e) => setRoleEn(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-[#F4F6F8]/80 font-medium mb-3">
          Accroche (petite phrase au-dessus du nom)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>FR</label>
            <input
              value={taglineFr}
              onChange={(e) => setTaglineFr(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>EN</label>
            <input
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-[#F4F6F8]/80 font-medium mb-3">
          Description (paragraphe sous le rôle)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>FR</label>
            <textarea
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              rows={5}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>EN</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={5}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 rounded-full bg-[#4DFFA0] text-[#1B2838] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Enregistrer
        </button>
        {success && (
          <p className="text-xs text-[#4DFFA0] font-[var(--font-ibm-plex-mono)]">
            Enregistré ✓
          </p>
        )}
        {error && (
          <p className="text-xs text-red-400 font-[var(--font-ibm-plex-mono)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}