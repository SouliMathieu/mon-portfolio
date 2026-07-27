"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Pencil, Trash2, Check, X, Star } from "lucide-react";
import { deleteProject } from "@/app/admin/(protected)/projects/actions";

type ProjectRowProps = {
  project: {
    id: number;
    slug: string;
    titleFr: string;
    categoryFr: string;
    featured: boolean;
    images: { url: string }[];
    technologies: { id: number; name: string }[];
  };
};

export default function ProjectRow({ project }: ProjectRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const cover = project.images[0]?.url;

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProject(project.id, project.slug);
    });
  };

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 relative">
            {cover ? (
              <Image
                src={cover}
                alt={project.titleFr}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#F4F6F8]/30 font-[var(--font-ibm-plex-mono)]">
                N/A
              </div>
            )}
          </div>
          <span className="text-sm text-[#F4F6F8]">{project.titleFr}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-[#F4F6F8]/70">
        {project.categoryFr}
      </td>

      <td className="px-6 py-4 text-sm text-[#F4F6F8]/70">
        {project.technologies
          .slice(0, 3)
          .map((t) => t.name)
          .join(", ")}
        {project.technologies.length > 3 &&
          ` +${project.technologies.length - 3}`}
      </td>

      <td className="px-6 py-4">
        {project.featured && (
          <Star size={16} className="text-[#4DFFA0]" fill="currentColor" />
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/projects/${project.id}/edit`}
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
      </td>
    </tr>
  );
}