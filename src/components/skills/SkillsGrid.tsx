'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Code2, Map, Satellite, type LucideIcon } from 'lucide-react';
import SkillBlockCard from './SkillBlockCard';

// Résolu ici (côté client) plutôt que dans page.tsx (serveur), car un
// composant React ne peut pas traverser la frontière Server → Client.
const ICONS: Record<string, LucideIcon> = {
  'full-stack': Code2,
  'geomatique-sig': Map,
  'geoai-data-science': Brain,
  'satellites-imagerie': Satellite,
};

type TechWithProjects = {
  id: number;
  name: string;
  level: number;
  projects: { slug: string; titleFr: string; titleEn: string }[];
};

type Block = {
  slug: string;
  title: string;
  description: string;
  technologies: TechWithProjects[];
};

type Props = {
  blocks: Block[];
  locale: string;
};

export default function SkillsGrid({ blocks, locale }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {blocks.map((block, i) => (
        <motion.div
          key={block.slug}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : i * 0.08,
            ease: 'easeOut',
          }}
        >
          <SkillBlockCard
            title={block.title}
            description={block.description}
            icon={ICONS[block.slug] ?? Code2}
            technologies={block.technologies}
            locale={locale}
          />
        </motion.div>
      ))}
    </div>
  );
}