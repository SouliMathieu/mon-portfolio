import Link from 'next/link';
import SignalLevel from './SignalLevel';

type TechWithProjects = {
  id: number;
  name: string;
  level: number;
  projects: { slug: string; titleFr: string; titleEn: string }[];
};

type Props = {
  tech: TechWithProjects;
  locale: string;
};

export default function TechnologyRow({ tech, locale }: Props) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="text-sm text-[#F4F6F8] md:text-base">{tech.name}</span>

        {tech.projects.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {tech.projects.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/projects/${p.slug}`}
                className="rounded-full border border-[#4DFFA0]/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-[#4DFFA0] transition-colors hover:bg-[#4DFFA0]/10"
              >
                {locale === 'fr' ? p.titleFr : p.titleEn}
              </Link>
            ))}
          </span>
        )}
      </div>

      <SignalLevel level={tech.level} locale={locale} />
    </div>
  );
}