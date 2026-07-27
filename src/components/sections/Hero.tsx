"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

// Pas de modèle dédié en base pour les hackathons (un seul évènement à ce
// jour) — à incrémenter manuellement si tu en fais un autre.
const HACKATHONS_COUNT = 1;

type HeroStats = {
  projects: number;
  technologies: number;
  certifications: number;
};

type HeroProps = {
  locale: string;
  stats: HeroStats;
};

export default function Hero({ locale, stats }: HeroProps) {
  const t = useTranslations("hero");
  const shouldReduceMotion = useReducedMotion();

  const statsDisplay = [
    { value: stats.projects, suffix: "+", label: t("stats.projects") },
    { value: HACKATHONS_COUNT, suffix: "", label: t("stats.hackathons") },
    {
      value: stats.technologies,
      suffix: "+",
      label: t("stats.technologies"),
    },
    {
      value: stats.certifications,
      suffix: "",
      label: t("stats.certifications"),
    },
  ];

  const cvHref =
    locale === "en" ? "/documents/cv-en.pdf" : "/documents/cv-fr.pdf";

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const item: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center px-8 md:px-16 lg:px-24">
      <motion.div
        className="max-w-xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="font-mono text-sm text-ndvi mb-4">
          {t("tagline")}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl md:text-6xl font-bold text-offwhite leading-tight mb-4"
        >
          {t("name")}
        </motion.h1>

        <motion.p variants={item} className="text-lg text-offwhite/70 mb-6">
          {t("role")}
        </motion.p>

        <motion.p
          variants={item}
          className="text-offwhite/80 mb-10 leading-relaxed"
        >
          {t("description")}
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4 mb-14">
          <Button variant="primary" href={`/${locale}/projects`}>
            {t("cta_projects")}
          </Button>
          <Button
            variant="secondary"
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cta_cv")}
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {statsDisplay.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-2xl font-semibold text-ndvi">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-offwhite/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}