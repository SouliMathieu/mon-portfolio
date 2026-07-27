"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Pencil, Trash2, Check, X, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import {
  deleteService,
  reorderService,
} from "@/app/admin/(protected)/services/actions";

type ServiceRowProps = {
  service: {
    id: number;
    titleFr: string;
    descriptionFr: string;
  };
  isFirst: boolean;
  isLast: boolean;
};

export default function ServiceRow({ service, isFirst, isLast }: ServiceRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteService(service.id);
    });
  };

  const handleMove = (direction: "up" | "down") => {
    startTransition(async () => {
      await reorderService(service.id, direction);
    });
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-3 min-w-0">
        <Sparkles size={18} className="text-[#4DFFA0] shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-[#F4F6F8] font-medium">{service.titleFr}</p>
          <p className="text-xs text-[#F4F6F8]/50 line-clamp-1">
            {service.descriptionFr}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => handleMove("up")}
          disabled={isFirst || isPending}
          className="p-2 rounded-lg text-[#F4F6F8]/60 hover:bg-white/5 hover:text-[#F4F6F8] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Monter"
        >
          <ArrowUp size={16} />
        </button>
        <button
          onClick={() => handleMove("down")}
          disabled={isLast || isPending}
          className="p-2 rounded-lg text-[#F4F6F8]/60 hover:bg-white/5 hover:text-[#F4F6F8] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Descendre"
        >
          <ArrowDown size={16} />
        </button>

        <Link
          href={`/admin/services/${service.id}/edit`}
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