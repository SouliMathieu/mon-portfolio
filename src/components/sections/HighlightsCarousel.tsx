"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";

interface Highlight {
  title: string;
  period: string;
  description: string;
}

export default function HighlightsCarousel() {
  const t = useTranslations("about");
  const highlights = t.raw("highlights") as Highlight[];
  const [index, setIndex] = useState(0);

  const goPrev = () =>
    setIndex((i) => (i === 0 ? highlights.length - 1 : i - 1));
  const goNext = () =>
    setIndex((i) => (i === highlights.length - 1 ? 0 : i + 1));

  const current = highlights[index];

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Précédent"
          className="flex-shrink-0 p-2 rounded-full border border-offwhite/20 hover:bg-offwhite/5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-offwhite" />
        </button>

        <Card className="flex-1 min-h-[140px] flex flex-col justify-center">
          <p className="font-mono text-xs text-ndvi mb-2">
            {current.period}
          </p>
          <h3 className="font-display text-xl font-semibold text-offwhite mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-offwhite/70">{current.description}</p>
        </Card>

        <button
          onClick={goNext}
          aria-label="Suivant"
          className="flex-shrink-0 p-2 rounded-full border border-offwhite/20 hover:bg-offwhite/5 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-offwhite" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {highlights.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Aller au highlight ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
              i === index ? "bg-ndvi" : "bg-offwhite/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}