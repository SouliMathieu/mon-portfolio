"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import TechnologyRow from "./TechnologyRow";
import {
  updateSkillBlock,
  deleteSkillBlock,
  createTechnology,
} from "@/app/admin/(protected)/skills/actions";

type Technology = {
  id: number;
  name: string;
  level: number;
};

type SkillBlockCardProps = {
  block: {
    id: number;
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    technologies: Technology[];
  };
};

export default function SkillBlockCard({ block }: SkillBlockCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingBlock, setEditingBlock] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [titleFr, setTitleFr] = useState(block.titleFr);
  const [titleEn, setTitleEn] = useState(block.titleEn);
  const [descriptionFr, setDescriptionFr] = useState(block.descriptionFr);
  const [descriptionEn, setDescriptionEn] = useState(block.descriptionEn);

  const [newTechName, setNewTechName] = useState("");
  const [newTechLevel, setNewTechLevel] = useState(3);

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors";

  const handleSaveBlock = () => {
    setError("");
    const formData = new FormData();
    formData.set("titleFr", titleFr);
    formData.set("titleEn", titleEn);
    formData.set("descriptionFr", descriptionFr);
    formData.set("descriptionEn", descriptionEn);

    startTransition(async () => {
      try {
        await updateSkillBlock(block.id, formData);
        setEditingBlock(false);
      } catch {
        setError("Erreur lors de l'enregistrement du bloc.");
      }
    });
  };

  const handleDeleteBlock = () => {
    setError("");
    const count = block.technologies.length;
    const confirmed = window.confirm(
      count > 0
        ? `Supprimer le bloc "${block.titleFr}" ? Les ${count} technologie${
            count > 1 ? "s" : ""
          } qu'il contient seront supprimées avec lui. Cette action est irréversible.`
        : `Supprimer le bloc "${block.titleFr}" ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteSkillBlock(block.id);
      } catch {
        setError("Erreur lors de la suppression du bloc.");
      }
    });
  };

  const handleAddTechnology = () => {
    setError("");
    if (!newTechName.trim()) return;

    const formData = new FormData();
    formData.set("name", newTechName.trim());
    formData.set("level", String(newTechLevel));

    startTransition(async () => {
      try {
        await createTechnology(block.id, formData);
        setNewTechName("");
        setNewTechLevel(3);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de l'ajout."
        );
      }
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <p className="font-[var(--font-space-grotesk)] text-lg text-[#F4F6F8]">
            {block.titleFr}
          </p>
          <p className="text-xs text-[#F4F6F8]/50 font-[var(--font-ibm-plex-mono)]">
            {block.technologies.length} technologie
            {block.technologies.length > 1 ? "s" : ""}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-[#F4F6F8]/50 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-6">
          {/* Contenu du bloc */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#F4F6F8]/80 font-medium">
                Contenu du bloc
              </p>
              {!editingBlock && (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingBlock(true)}
                    className="flex items-center gap-1.5 text-xs text-[#4DFFA0] hover:opacity-80 transition-opacity"
                  >
                    <Pencil size={12} />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteBlock}
                    disabled={isPending}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Supprimer le bloc
                  </button>
                </div>
              )}
            </div>

            {editingBlock ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    placeholder="Titre FR"
                    className={inputClass}
                  />
                  <input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Titre EN"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <textarea
                    value={descriptionFr}
                    onChange={(e) => setDescriptionFr(e.target.value)}
                    placeholder="Description FR"
                    rows={3}
                    className={inputClass}
                  />
                  <textarea
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Description EN"
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveBlock}
                    disabled={isPending}
                    className="px-4 py-2 rounded-full bg-[#4DFFA0] text-[#1B2838] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlock(false);
                      setTitleFr(block.titleFr);
                      setTitleEn(block.titleEn);
                      setDescriptionFr(block.descriptionFr);
                      setDescriptionEn(block.descriptionEn);
                    }}
                    className="px-4 py-2 rounded-full text-xs text-[#F4F6F8]/60 hover:bg-white/5 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#F4F6F8]/60">
                {block.descriptionFr}
              </p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <p className="text-sm text-[#F4F6F8]/80 font-medium mb-3">
              Technologies
            </p>

            <div className="space-y-1">
              {block.technologies.map((tech) => (
                <TechnologyRow key={tech.id} technology={tech} />
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <input
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                placeholder="Nouvelle technologie"
                className={`${inputClass} flex-1 min-w-[160px]`}
              />
              <select
                value={newTechLevel}
                onChange={(e) => setNewTechLevel(Number(e.target.value))}
                className={inputClass}
                style={{ width: "auto" }}
              >
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Niveau {lvl}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddTechnology}
                disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4DFFA0] text-[#1B2838] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
              >
                <Plus size={14} />
                Ajouter
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 font-[var(--font-ibm-plex-mono)]">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}