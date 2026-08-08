import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';

type ProjectData = {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string | null;
  coverAlt?: string;
  demoUrl: string | null;
  codeUrl: string | null;
  technologies: string[];
};

type Props = {
  project: ProjectData;
  locale: string;
};

export default function FeaturedProject({ project, locale }: Props) {
  const eyebrow = locale === 'fr' ? 'Mission en vedette' : 'Featured mission';
  const demoLabel = locale === 'fr' ? 'Voir la démo' : 'View demo';
  const codeLabel = locale === 'fr' ? 'Voir le code' : 'View code';
  const detailLabel = locale === 'fr' ? 'Voir le détail' : 'View details';
  const noSignal = locale === 'fr' ? 'PAS DE SIGNAL' : 'NO SIGNAL';

  return (
    <div className="grid overflow-hidden rounded-3xl border border-[#4DFFA0]/20 bg-white/5 backdrop-blur-xl md:grid-cols-2">
      {/* Hauteur minimale plutôt qu'un ratio figé sur desktop, et
          object-contain plutôt que cover : marche pour un screenshot
          mobile en portrait comme pour une capture desktop en paysage,
          sans jamais rogner l'image. */}
      <div className="relative aspect-[16/10] min-h-[280px] bg-[#0F1720] md:aspect-auto md:min-h-[480px]">
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.coverAlt || project.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#F4F6F8]/20">
            <span className="font-mono text-xs">{noSignal}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4DFFA0]">
          {eyebrow}
        </span>
        <h2 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] md:text-3xl">
          {project.title}
        </h2>
        <span className="font-mono text-xs uppercase tracking-wide text-[#F4F6F8]/40">
          {project.category}
        </span>
        <p className="text-[#F4F6F8]/60">{project.description}</p>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#F4F6F8]/60"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#4DFFA0] px-5 py-2.5 text-sm font-medium text-[#1B2838] transition-transform hover:scale-105"
          >
            {detailLabel}
            <ArrowUpRight size={16} />
          </Link>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm text-[#F4F6F8]/80 transition-colors hover:border-white/30"
            >
              <ExternalLink size={16} />
              {demoLabel}
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm text-[#F4F6F8]/80 transition-colors hover:border-white/30"
            >
              <GithubIcon size={16} />
              {codeLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}