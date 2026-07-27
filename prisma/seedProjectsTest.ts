import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * ⚠️ DONNÉES FICTIVES — uniquement pour tester la grille de projets et les
 * pages de détail (Phase 5) avant que le contenu réel ne soit disponible.
 * Tous les titres sont préfixés "[TEST]" pour être impossibles à confondre
 * avec du vrai contenu. À supprimer depuis le backoffice une fois les
 * vrais projets ajoutés (cf. cahier des charges §6 : aucun placeholder ne
 * doit subsister en production).
 */

type ProjectInput = {
  slug: string;
  titleFr: string;
  titleEn: string;
  categoryFr: string;
  categoryEn: string;
  descriptionFr: string;
  descriptionEn: string;
  featured: boolean;
  order: number;
  technologyNames: string[];
};

const TEST_NOTE_FR =
  ' (Projet fictif généré pour tester la mise en page — contenu à remplacer.)';
const TEST_NOTE_EN =
  ' (Fictional project generated to test the layout — content to be replaced.)';

const projects: ProjectInput[] = [
  {
    slug: 'test-aquatrack-ai',
    titleFr: '[TEST] AquaTrack AI',
    titleEn: '[TEST] AquaTrack AI',
    categoryFr: 'GeoAI',
    categoryEn: 'GeoAI',
    descriptionFr:
      "Plateforme de suivi de la ressource en eau combinant imagerie satellite et machine learning pour anticiper les risques de pénurie à l'échelle régionale." +
      TEST_NOTE_FR,
    descriptionEn:
      'Water resource monitoring platform combining satellite imagery and machine learning to anticipate regional shortage risks.' +
      TEST_NOTE_EN,
    featured: true,
    order: 1,
    technologyNames: ['Python', 'Machine Learning', 'Télédétection', 'NDVI / NDWI (indices spectraux)'],
  },
  {
    slug: 'test-cadastre-pro',
    titleFr: '[TEST] CadastrePro',
    titleEn: '[TEST] CadastrePro',
    categoryFr: 'SIG',
    categoryEn: 'GIS',
    descriptionFr:
      'Outil de gestion cadastrale permettant la digitalisation, la vectorisation et le contrôle qualité des parcelles directement depuis le navigateur.' +
      TEST_NOTE_FR,
    descriptionEn:
      'Cadastral management tool enabling parcel digitization, vectorization, and quality control directly from the browser.' +
      TEST_NOTE_EN,
    featured: false,
    order: 2,
    technologyNames: ['QGIS', 'PostGIS', 'Modélisation de données géographiques'],
  },
  {
    slug: 'test-urbanpulse',
    titleFr: '[TEST] UrbanPulse',
    titleEn: '[TEST] UrbanPulse',
    categoryFr: 'Web',
    categoryEn: 'Web',
    descriptionFr:
      "Tableau de bord web temps réel pour visualiser les indicateurs de densité urbaine et de mobilité d'une agglomération." +
      TEST_NOTE_FR,
    descriptionEn:
      'Real-time web dashboard visualizing urban density and mobility indicators for a metropolitan area.' +
      TEST_NOTE_EN,
    featured: false,
    order: 3,
    technologyNames: ['Next.js / React', 'TypeScript', 'Leaflet / Mapbox GL'],
  },
  {
    slug: 'test-fieldmapper',
    titleFr: '[TEST] FieldMapper',
    titleEn: '[TEST] FieldMapper',
    categoryFr: 'Mobile',
    categoryEn: 'Mobile',
    descriptionFr:
      'Application mobile de collecte de données terrain géolocalisées, avec fonctionnement hors-ligne et synchronisation automatique.' +
      TEST_NOTE_FR,
    descriptionEn:
      'Mobile app for geolocated field data collection, with offline mode and automatic sync.' +
      TEST_NOTE_EN,
    featured: false,
    order: 4,
    technologyNames: ['TypeScript', 'Analyse spatiale'],
  },
  {
    slug: 'test-geovault',
    titleFr: '[TEST] GeoVault',
    titleEn: '[TEST] GeoVault',
    categoryFr: 'Desktop',
    categoryEn: 'Desktop',
    descriptionFr:
      'Application desktop de gestion et de versionnement de jeux de données géospatiales volumineux pour équipes SIG.' +
      TEST_NOTE_FR,
    descriptionEn:
      'Desktop application for managing and versioning large geospatial datasets for GIS teams.' +
      TEST_NOTE_EN,
    featured: false,
    order: 5,
    technologyNames: ['Node.js', 'Big Data Spatial'],
  },
  {
    slug: 'test-forestwatch',
    titleFr: '[TEST] ForestWatch',
    titleEn: '[TEST] ForestWatch',
    categoryFr: 'Télédétection',
    categoryEn: 'Remote Sensing',
    descriptionFr:
      "Système de détection de la déforestation basé sur l'analyse de séries temporelles d'imagerie satellite Sentinel." +
      TEST_NOTE_FR,
    descriptionEn:
      'Deforestation detection system based on time-series analysis of Sentinel satellite imagery.' +
      TEST_NOTE_EN,
    featured: false,
    order: 6,
    technologyNames: ['Imagerie satellite (Sentinel/Landsat)', 'Google Earth Engine'],
  },
];

async function getTechnologyConnections(names: string[]) {
  if (names.length === 0) return undefined;

  const found = await prisma.technology.findMany({
    where: { name: { in: names } },
    select: { id: true, name: true },
  });

  const missing = names.filter((n) => !found.some((f) => f.name === n));
  if (missing.length > 0) {
    console.warn(`⚠️  Technologie(s) introuvable(s), lien ignoré : ${missing.join(', ')}`);
  }

  return found.length > 0 ? { connect: found.map((t) => ({ id: t.id })) } : undefined;
}

async function main() {
  for (const project of projects) {
    const technologies = await getTechnologyConnections(project.technologyNames);

    const saved = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        titleFr: project.titleFr,
        titleEn: project.titleEn,
        categoryFr: project.categoryFr,
        categoryEn: project.categoryEn,
        descriptionFr: project.descriptionFr,
        descriptionEn: project.descriptionEn,
        featured: project.featured,
        order: project.order,
        ...(technologies ? { technologies } : {}),
      },
      create: {
        slug: project.slug,
        titleFr: project.titleFr,
        titleEn: project.titleEn,
        categoryFr: project.categoryFr,
        categoryEn: project.categoryEn,
        descriptionFr: project.descriptionFr,
        descriptionEn: project.descriptionEn,
        featured: project.featured,
        order: project.order,
        ...(technologies ? { technologies } : {}),
      },
    });

    // ProjectImage n'a pas de contrainte unique : on repart d'une table
    // propre pour ce projet à chaque run, pour rester idempotent.
    await prisma.projectImage.deleteMany({ where: { projectId: saved.id } });
    await prisma.projectImage.create({
      data: {
        url: `/images/projects/${project.slug}/cover.svg`,
        altFr: `Visuel du projet ${project.titleFr.replace('[TEST] ', '')}`,
        altEn: `Cover image for ${project.titleEn.replace('[TEST] ', '')}`,
        order: 0,
        projectId: saved.id,
      },
    });

    console.log(`✅ Projet "${project.titleFr}" seedé (+ image de couverture).`);
  }

  console.log('\n✅ Seed Projets fictifs (Phase 5 - test) terminé.');
  console.log('⚠️  Pense à supprimer ces 6 projets via le backoffice une fois le vrai contenu prêt.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
