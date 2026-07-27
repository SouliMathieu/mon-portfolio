"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Pencil, Trash2, Check, X, ExternalLink, Award } from "lucide-react";
import { deleteCertification } from "@/app/admin/(protected)/certifications/actions";

type CertificationRowProps = {
  certification: {
    id: number;
    titleFr: string;
    issuer: string;
    date: string;
    url: string | null;
  };
};

export default function CertificationRow({
  certification,
}: CertificationRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formattedDate = new Date(certification.date).toLocaleDateString(
    "fr-FR",
    { month: "long", year: "numeric" }
  );

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCertification(certification.id);
    });
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-3 min-w-0">
        <Award size={18} className="text-[#4DFFA0] shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#F4F6F8] font-medium">
              {certification.titleFr}
            </span>
            {certification.url && (
              <a
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4DFFA0] hover:opacity-80 transition-opacity"
                aria-label="Voir le certificat"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <p className="text-xs text-[#F4F6F8]/50 font-[var(--font-ibm-plex-mono)]">
            {certification.issuer} · {formattedDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/admin/certifications/${certification.id}/edit`}
          className="p-2 rounded-lg text-[#F4F6F8]/60 hover:bg-white/5 hover:text-[#F4F6F8] transition-colors"
          aria-label="Modifier"
        >
          <Pencil size={16} />
        </Link>

        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50"
              aria-label="Confirmer la suppression"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="p-2 rounded-lg text-[#F4F6F8]/60 hover:bg-white/5 transition-colors"
              aria-label="Annuler"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="p-2 rounded-lg text-[#F4F6F8]/60 hover:bg-white/5 hover:text-red-400 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}