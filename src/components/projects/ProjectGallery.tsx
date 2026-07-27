'use client';

import { useState } from 'react';
import Image from 'next/image';

type GalleryImage = { url: string; alt: string };

type Props = {
  images: GalleryImage[];
  locale: string;
};

export default function ProjectGallery({ images, locale }: Props) {
  const [active, setActive] = useState(0);
  const noSignal = locale === 'fr' ? 'PAS DE SIGNAL' : 'NO SIGNAL';

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-3xl border border-white/10 bg-[#0F1720] text-[#F4F6F8]/20">
        <span className="font-mono text-xs">{noSignal}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-[#0F1720]">
        <Image
          src={images[active].url}
          alt={images[active].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              aria-label={`${locale === 'fr' ? 'Image' : 'Image'} ${i + 1}`}
              aria-pressed={i === active}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DFFA0]/50 ${
                i === active ? 'border-[#4DFFA0]' : 'border-white/10 hover:border-white/25'
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}