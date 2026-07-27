import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * ⚠️ Slug du projet "Water Credit AI" tel qu'enregistré dans ta table Project.
 * Vérifie qu'il correspond exactement (Prisma Studio ou ton seed de projets).
 * Si le slug est incorrect, le script ignore simplement la liaison (avec un warning),
 * il ne plantera pas.
 */
const WATER_CREDIT_SLUG = 'water-credit-ai';

type TechInput = {
  name: string;
  level: number; // 1 (débutant) à 5 (expert)
  projectSlugs?: string[];
};

type BlockInput = {
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  order: number;
  technologies: TechInput[];
};

const blocks: BlockInput[] = [
  {
    slug: 'full-stack',
    titleFr: 'Développement Full Stack',
    titleEn: 'Full Stack Development',
    descriptionFr:
      "Conception et développement d'applications web modernes, du frontend au backend, avec une attention particulière portée à la performance et à l'expérience utilisateur.",
    descriptionEn:
      'Designing and building modern web applications, from frontend to backend, with strong attention to performance and user experience.',
    order: 1,
    technologies: [
      { name: 'Next.js / React', level: 4 },
      { name: 'TypeScript', level: 4 },
      { name: 'Tailwind CSS', level: 4 },
      { name: 'Node.js', level: 3 },
      { name: 'Prisma ORM', level: 3 },
      { name: 'MySQL / PostgreSQL', level: 3 },
      { name: 'Git / GitHub', level: 4 },
      { name: 'NextAuth.js', level: 2 },
    ],
  },
  {
    slug: 'geomatique-sig',
    titleFr: 'Géomatique & SIG',
    titleEn: 'Geomatics & GIS',
    descriptionFr:
      "Analyse, traitement et modélisation de données géospatiales à l'aide des outils SIG standards de l'industrie.",
    descriptionEn:
      'Analysis, processing, and modeling of geospatial data using industry-standard GIS tools.',
    order: 2,
    technologies: [
      { name: 'QGIS', level: 4 },
      { name: 'PostGIS', level: 3 },
      { name: 'Analyse spatiale', level: 4, projectSlugs: [WATER_CREDIT_SLUG] },
      { name: 'Leaflet / Mapbox GL', level: 3 },
      { name: 'Modélisation de données géographiques', level: 4 },
    ],
  },
  {
    slug: 'geoai-data-science',
    titleFr: 'GeoAI & Data Science',
    titleEn: 'GeoAI & Data Science',
    descriptionFr:
      'Application du machine learning aux données géospatiales pour en extraire des insights actionnables à grande échelle.',
    descriptionEn:
      'Applying machine learning to geospatial data to extract actionable insights at scale.',
    order: 3,
    technologies: [
      { name: 'Python', level: 4, projectSlugs: [WATER_CREDIT_SLUG] },
      { name: 'Machine Learning', level: 3, projectSlugs: [WATER_CREDIT_SLUG] },
      { name: 'Big Data Spatial', level: 3 },
      { name: 'APIs géospatiales', level: 3, projectSlugs: [WATER_CREDIT_SLUG] },
    ],
  },
  {
    slug: 'satellites-imagerie',
    titleFr: 'Satellites & Imagerie',
    titleEn: 'Satellites & Imagery',
    descriptionFr:
      "Exploitation de l'imagerie satellite et des indices spectraux pour le suivi environnemental et la prise de décision.",
    descriptionEn:
      'Leveraging satellite imagery and spectral indices for environmental monitoring and decision-making.',
    order: 4,
    technologies: [
      { name: 'Télédétection', level: 4, projectSlugs: [WATER_CREDIT_SLUG] },
      { name: 'NDVI / NDWI (indices spectraux)', level: 4, projectSlugs: [WATER_CREDIT_SLUG] },
      { name: 'Imagerie satellite (Sentinel/Landsat)', level: 3, projectSlugs: [WATER_CREDIT_SLUG] },
      { name: 'Google Earth Engine', level: 2 },
    ],
  },
];

async function getProjectConnections(slugs?: string[]) {
  if (!slugs || slugs.length === 0) return undefined;

  const existing = await prisma.project.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true },
  });
  const foundSlugs = existing.map((p) => p.slug);
  const missing = slugs.filter((s) => !foundSlugs.includes(s));

  if (missing.length > 0) {
    console.warn(`⚠️  Projet(s) introuvable(s) en base, liaison ignorée : ${missing.join(', ')}`);
  }

  return foundSlugs.length > 0 ? { connect: foundSlugs.map((slug) => ({ slug })) } : undefined;
}

async function main() {
  for (const block of blocks) {
    const skillBlock = await prisma.skillBlock.upsert({
      where: { slug: block.slug },
      update: {
        titleFr: block.titleFr,
        titleEn: block.titleEn,
        descriptionFr: block.descriptionFr,
        descriptionEn: block.descriptionEn,
        order: block.order,
      },
      create: {
        slug: block.slug,
        titleFr: block.titleFr,
        titleEn: block.titleEn,
        descriptionFr: block.descriptionFr,
        descriptionEn: block.descriptionEn,
        order: block.order,
      },
    });

    for (const tech of block.technologies) {
      const projects = await getProjectConnections(tech.projectSlugs);

      await prisma.technology.upsert({
        where: {
          name_skillBlockId: {
            name: tech.name,
            skillBlockId: skillBlock.id,
          },
        },
        update: {
          level: tech.level,
          ...(projects ? { projects } : {}),
        },
        create: {
          name: tech.name,
          level: tech.level,
          skillBlockId: skillBlock.id,
          ...(projects ? { projects } : {}),
        },
      });
    }

    console.log(`✅ Bloc "${block.titleFr}" (${block.technologies.length} technologies) seedé.`);
  }

  console.log('\n✅ Seed Compétences (Phase 4) terminé avec succès.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });