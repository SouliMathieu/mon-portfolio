import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import SkillsGrid from '@/components/skills/SkillsGrid';

// ⚠️ Ajuste l'import ci-dessus si ton client Prisma singleton n'est pas
// exporté depuis "@/lib/prisma" (adapte le chemin à ta convention réelle).
//
// Important : les composants icônes lucide-react ne sont PAS transmis ici.
// Un Server Component ne peut pas passer un composant React à un Client
// Component (erreur "Only plain objects can be passed..."). On transmet
// donc uniquement le `slug` (string) — c'est SkillsGrid.tsx, déjà côté
// client, qui résout l'icône correspondante localement.
export const dynamic = "force-dynamic";
export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Skills');

  const skillBlocks = await prisma.skillBlock.findMany({
    orderBy: { order: 'asc' },
    include: {
      technologies: {
        orderBy: [{ level: 'desc' }, { name: 'asc' }],
        include: {
          projects: {
            select: { slug: true, titleFr: true, titleEn: true },
          },
        },
      },
    },
  });

  const blocks = skillBlocks.map((block) => ({
    slug: block.slug,
    title: locale === 'fr' ? block.titleFr : block.titleEn,
    description: locale === 'fr' ? block.descriptionFr : block.descriptionEn,
    technologies: block.technologies.map((tech) => ({
      id: tech.id,
      name: tech.name,
      level: tech.level,
      projects: tech.projects,
    })),
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

      <SkillsGrid blocks={blocks} locale={locale} />
    </main>
  );
}