'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FeaturedProject from './FeaturedProject';
import ProjectCard from './ProjectCard';
import CategoryFilter from './CategoryFilter';

type ProjectData = {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string | null;
  coverAlt?: string;
  featured: boolean;
  demoUrl: string | null;
  codeUrl: string | null;
  technologies: string[];
};

type Props = {
  projects: ProjectData[];
  locale: string;
};

export default function ProjectsGrid({ projects, locale }: Props) {
  const allLabel = locale === 'fr' ? 'Tous' : 'All';
  const projectsCountLabel = locale === 'fr' ? 'projets' : 'projects';
  const emptyLabel =
    locale === 'fr'
      ? 'Aucun projet dans cette catégorie pour le moment.'
      : 'No projects in this category yet.';

  const featured = projects.find((p) => p.featured) ?? null;
  const rest = projects.filter((p) => !featured || p.slug !== featured.slug);

  const categories = useMemo(() => Array.from(new Set(rest.map((p) => p.category))), [rest]);

  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected ? rest.filter((p) => p.category === selected) : rest;

  return (
    <div className="space-y-14">
      {featured && <FeaturedProject project={featured} locale={locale} />}

      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <CategoryFilter
            categories={categories}
            selected={selected}
            onSelect={setSelected}
            allLabel={allLabel}
          />
          <span className="font-mono text-xs text-[#F4F6F8]/40">
            {filtered.length.toString().padStart(2, '0')} {projectsCountLabel}
          </span>
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectCard project={project} locale={locale} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-[#F4F6F8]/40">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}