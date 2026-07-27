import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Projects');

  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      technologies: { select: { name: true } },
    },
  });

  // Uniquement des données sérialisables (strings/booleans/arrays) transmises
  // au Client Component ProjectsGrid — pas de composant icône ici (cf. bug
  // rencontré en Phase 4).
  const mapped = projects.map((p) => ({
    slug: p.slug,
    title: locale === 'fr' ? p.titleFr : p.titleEn,
    category: locale === 'fr' ? p.categoryFr : p.categoryEn,
    description: locale === 'fr' ? p.descriptionFr : p.descriptionEn,
    coverUrl: p.images[0]?.url ?? null,
    coverAlt: (locale === 'fr' ? p.images[0]?.altFr : p.images[0]?.altEn) ?? undefined,
    featured: p.featured,
    demoUrl: p.demoUrl,
    codeUrl: p.codeUrl,
    technologies: p.technologies.map((tech) => tech.name),
  }));

  return (
    <main className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
      <header className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4DFFA0]">
          {t('eyebrow')}
        </p>
        <h1 className="mt-4 font-[var(--font-space-grotesk)] text-4xl text-[#F4F6F8] md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-[#F4F6F8]/60 md:text-lg">{t('subtitle')}</p>
      </header>

      <ProjectsGrid projects={mapped} locale={locale} />
    </main>
  );
}