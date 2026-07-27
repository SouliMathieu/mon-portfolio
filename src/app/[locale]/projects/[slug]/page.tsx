import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import GithubIcon from '@/components/icons/GithubIcon';
import ProjectGallery from '@/components/projects/ProjectGallery';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('Projects');

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      technologies: { select: { id: true, name: true } },
    },
  });

  if (!project) {
    notFound();
  }

  const title = locale === 'fr' ? project.titleFr : project.titleEn;
  const category = locale === 'fr' ? project.categoryFr : project.categoryEn;
  const description = locale === 'fr' ? project.descriptionFr : project.descriptionEn;

  const images = project.images.map((img) => ({
    url: img.url,
    alt: (locale === 'fr' ? img.altFr : img.altEn) || title,
  }));

  return (
    <main className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
      <Link
        href={`/${locale}/projects`}
        className="mb-10 inline-flex items-center gap-2 text-sm text-[#F4F6F8]/60 transition-colors hover:text-[#4DFFA0]"
      >
        <ArrowLeft size={16} />
        {t('backToProjects')}
      </Link>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4DFFA0]">
        {category}
      </span>
      <h1 className="mt-4 font-[var(--font-space-grotesk)] text-3xl text-[#F4F6F8] md:text-5xl">
        {title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#4DFFA0] px-5 py-2.5 text-sm font-medium text-[#1B2838] transition-transform hover:scale-105"
          >
            <ExternalLink size={16} />
            {t('viewDemo')}
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
            {t('viewCode')}
          </a>
        )}
      </div>

      <div className="mt-12">
        <ProjectGallery images={images} locale={locale} />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-[var(--font-space-grotesk)] text-xl text-[#F4F6F8]">
            {t('aboutTitle')}
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-[#F4F6F8]/70">
            {description}
          </p>
        </div>

        {project.technologies.length > 0 && (
          <div>
            <h2 className="font-[var(--font-space-grotesk)] text-xl text-[#F4F6F8]">
              {t('stackTitle')}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#F4F6F8]/60"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}