'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import TechnologyRow from './TechnologyRow';

type TechWithProjects = {
  id: number;
  name: string;
  level: number;
  projects: { slug: string; titleFr: string; titleEn: string }[];
};

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  technologies: TechWithProjects[];
  locale: string;
};

export default function SkillBlockCard({
  title,
  description,
  icon: Icon,
  technologies,
  locale,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.35;

  return (
    <motion.div
      layout
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, borderColor: 'rgba(77, 255, 160, 0.35)' }
      }
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-start gap-4 rounded-3xl p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DFFA0]/50 md:p-8"
        aria-expanded={expanded}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4DFFA0]/10 text-[#4DFFA0] transition-colors group-hover:bg-[#4DFFA0]/20">
          <Icon size={22} strokeWidth={1.75} />
        </span>

        <span className="flex-1">
          <span className="flex items-center justify-between gap-3">
            <h3 className="font-[var(--font-space-grotesk)] text-xl text-[#F4F6F8] md:text-2xl">
              {title}
            </h3>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeInOut' }}
              className="text-[#F4F6F8]/50 transition-colors group-hover:text-[#4DFFA0]"
            >
              <ChevronDown size={20} />
            </motion.span>
          </span>

          <p className="mt-2 text-sm leading-relaxed text-[#F4F6F8]/60 md:text-base">
            {description}
          </p>

          <span className="mt-3 inline-block font-mono text-xs text-[#F4F6F8]/40">
            {technologies.length.toString().padStart(2, '0')} technologies
          </span>
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="space-y-4 border-t border-white/10 px-6 py-6 md:px-8">
          {technologies.map((tech) => (
            <TechnologyRow key={tech.id} tech={tech} locale={locale} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}