"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Check, X } from "lucide-react";

export default function LogoutButton() {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
        <span className="text-xs text-[#F4F6F8]/70 font-[var(--font-ibm-plex-mono)]">
          Confirmer ?
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
          aria-label="Confirmer la déconnexion"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-[#F4F6F8]/70 transition-colors"
          aria-label="Annuler"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#F4F6F8]/70 hover:bg-white/5 hover:text-[#F4F6F8] transition-colors w-full"
    >
      <LogOut size={16} />
      Déconnexion
    </button>
  );
}