"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Award, ChevronDown, ExternalLink, FileText } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Card from "@/components/ui/Card";

type CertificationItem = {
  title: string;
  issuer: string;
  date: string;
  url: string | null;
  fileUrl: string | null;
};

type CertificationsProps = {
  certifications: CertificationItem[];
  heading: string;
};

const INITIAL_VISIBLE = 6;

function isPdf(url: string | null) {
  return !!url && url.toLowerCase().endsWith(".pdf");
}

export default function Certifications({
  certifications,
  heading,
}: CertificationsProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("about.certifications");

  if (!certifications || certifications.length === 0) {
    return null;
  }

  const hasMore = certifications.length > INITIAL_VISIBLE;
  const visible = expanded
    ? certifications
    : certifications.slice(0, INITIAL_VISIBLE);
  const hiddenCount = certifications.length - INITIAL_VISIBLE;

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h2 className="font-display text-2xl font-semibold text-offwhite mb-6">
        {heading}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {visible.map((cert, i) => {
            const isExtra = i >= INITIAL_VISIBLE;
            return (
              <motion.div
                key={i}
                initial={
                  isExtra && !shouldReduceMotion
                    ? { opacity: 0, y: -8 }
                    : false
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? undefined : { opacity: 0, y: -8 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.25,
                  ease: "easeOut",
                }}
              >
                <Card className="flex items-start gap-3 h-full">
                  {cert.fileUrl ? (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg overflow-hidden bg-navy-light shrink-0 relative flex items-center justify-center"
                      aria-label="Voir le fichier du certificat"
                    >
                      {isPdf(cert.fileUrl) ? (
                        <FileText className="w-5 h-5 text-ndvi" />
                      ) : (
                        <Image
                          src={cert.fileUrl}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </a>
                  ) : (
                    <Award className="w-5 h-5 text-ndvi shrink-0 mt-0.5" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-offwhite">
                      {cert.title}
                    </p>
                    <p className="text-xs text-offwhite/60 font-mono mt-0.5">
                      {cert.issuer} · {cert.date}
                    </p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-ndvi hover:opacity-80 transition-opacity mt-2"
                      >
                        {t("verify")} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-ndvi hover:opacity-80 transition-opacity font-mono"
          >
            {expanded ? t("showLess") : t("showMore", { count: hiddenCount })}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>
        </div>
      )}
    </div>
  );
}