import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type ProjectData = {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string | null;
  coverAlt?: string;
};

type Props = {
  project: ProjectData;
  locale: string;
};

export default function ProjectCard({ project, locale }: Props) {
  const noSignal = locale === 'fr' ? 'PAS DE SIGNAL' : 'NO SIGNAL';

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-colors hover:border-[#4DFFA0]/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F1720]">
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.coverAlt || project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#F4F6F8]/20">
            <span className="font-mono text-xs">{noSignal}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="font-mono text-xs uppercase tracking-wide text-[#4DFFA0]">
          {project.category}
        </span>
        <h3 className="flex items-center gap-2 font-[var(--font-space-grotesk)] text-lg text-[#F4F6F8]">
          {project.title}
          <ArrowUpRight
            size={16}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </h3>
        <p className="line-clamp-2 text-sm text-[#F4F6F8]/60">{project.description}</p>
      </div>
    </Link>
  );
}