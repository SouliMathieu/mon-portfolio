"use client";

import { useState, useRef, type DragEvent } from "react";
import Image from "next/image";
import { Upload, X, ImageOff, Star } from "lucide-react";

type ExistingImage = {
  id: number;
  url: string;
};

type ImageDropzoneProps = {
  existingImages: ExistingImage[];
  onRemoveExisting: (id: number) => void;
  onSetCover: (id: number) => void;
  newFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
};

export default function ImageDropzone({
  existingImages,
  onRemoveExisting,
  onSetCover,
  newFiles,
  onAddFiles,
  onRemoveNewFile,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) onAddFiles(files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isEmpty = existingImages.length === 0 && newFiles.length === 0;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
          isDragging
            ? "border-[#4DFFA0] bg-[#4DFFA0]/5"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        <Upload size={20} className="text-[#F4F6F8]/50" />
        <p className="text-sm text-[#F4F6F8]/60">
          Glisse des images ici ou clique pour parcourir
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {!isEmpty && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {existingImages.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
            >
              <Image src={img.url} alt="" fill className="object-cover" />

              <button
                type="button"
                onClick={() => onRemoveExisting(img.id)}
                className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Supprimer cette image"
              >
                <X size={12} />
              </button>

              {index === 0 ? (
                <span className="absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#4DFFA0]/90 text-[#1B2838] text-[10px] font-semibold">
                  <Star size={10} fill="currentColor" />
                  Principale
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSetCover(img.id)}
                  className="absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <Star size={10} />
                  Définir principale
                </button>
              )}
            </div>
          ))}

          {newFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
            >
              {/* Prévisualisation locale avant upload : <img> natif nécessaire car next/image ne gère pas les blob URLs */}
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveNewFile(index)}
                className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer cette image"
              >
                <X size={12} />
              </button>
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#4DFFA0]/90 text-[#1B2838] text-[10px] font-semibold">
                nouveau
              </span>
            </div>
          ))}
        </div>
      )}

      {isEmpty && (
        <p className="flex items-center gap-2 mt-3 text-xs text-[#F4F6F8]/40">
          <ImageOff size={14} /> Aucune image pour l&apos;instant
        </p>
      )}
    </div>
  );
}