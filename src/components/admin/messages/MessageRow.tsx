"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { ChevronDown, Mail, MailOpen, Trash2, Check, X } from "lucide-react";
import {
  toggleMessageRead,
  deleteMessage,
} from "@/app/admin/(protected)/messages/actions";

type MessageRowProps = {
  message: {
    id: number;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  };
};

export default function MessageRow({ message }: MessageRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formattedDate = new Date(message.createdAt).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const handleExpand = () => {
    const opening = !expanded;
    setExpanded(opening);
    if (opening && !message.isRead) {
      startTransition(() => {
        toggleMessageRead(message.id, true);
      });
    }
  };

  const handleToggleRead = (e: MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      toggleMessageRead(message.id, !message.isRead);
    });
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      deleteMessage(message.id);
    });
  };

  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl overflow-hidden transition-colors ${
        message.isRead
          ? "border-white/10 bg-white/5"
          : "border-[#4DFFA0]/30 bg-[#4DFFA0]/5"
      }`}
    >
      <button
        type="button"
        onClick={handleExpand}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          {!message.isRead && (
            <span className="w-2 h-2 rounded-full bg-[#4DFFA0] shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[#F4F6F8] font-medium">
                {message.name}
              </span>
              <span className="text-xs text-[#F4F6F8]/40 font-[var(--font-ibm-plex-mono)]">
                {message.email}
              </span>
            </div>
            {!expanded && (
              <p className="text-xs text-[#F4F6F8]/50 truncate mt-0.5 max-w-md">
                {message.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-[#F4F6F8]/40 font-[var(--font-ibm-plex-mono)] whitespace-nowrap">
            {formattedDate}
          </span>
          <ChevronDown
            size={16}
            className={`text-[#F4F6F8]/50 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/10 pt-4">
          <p className="text-sm text-[#F4F6F8]/80 whitespace-pre-line mb-4">
            {message.message}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`mailto:${message.email}`}
              className="px-3 py-1.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Répondre par email
            </a>

            <button
              type="button"
              onClick={handleToggleRead}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#F4F6F8] hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {message.isRead ? <Mail size={12} /> : <MailOpen size={12} />}
              {message.isRead ? "Marquer non lu" : "Marquer lu"}
            </button>

            {confirmingDelete ? (
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs text-[#F4F6F8]/60 mr-1">
                  Supprimer ?
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  aria-label="Confirmer la suppression"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmingDelete(false);
                  }}
                  className="p-1.5 rounded-md text-[#F4F6F8]/60 hover:bg-white/10 transition-colors"
                  aria-label="Annuler"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingDelete(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#F4F6F8]/50 hover:text-red-400 hover:bg-white/5 transition-colors ml-auto"
              >
                <Trash2 size={12} />
                Supprimer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}