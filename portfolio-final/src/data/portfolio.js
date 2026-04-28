// ============================================
// PORTFOLIO DATA — SOULI MATHIEU
// ============================================

export const profile = {
  name: 'SOULI MATHIEU',
  firstName: 'Mathieu',
  lastName: 'Souli',
  title: 'Étudiant Ingénieur Géoinformation',
  subtitle: 'SIG · Développement Mobile · Télédétection',
  tagline: "Je conçois des applications géospatiales alliant cartographie, développement et intelligence artificielle.",
  bio: "Étudiant ingénieur en Géoinformation à la FST de Tanger (Université Abdelmalek Essaâdi), spécialisé en SIG, développement d'applications géolocalisées et télédétection. Je recherche un stage PFA de 2 mois pour contribuer à des projets concrets alliant géodonnées, développement et intelligence artificielle.",
  location: 'Tanger, Maroc',
  email: 'souli.mathieu@etu.uae.ac.ma',
  phone: '+212 688 192 586',
  availability: 'Disponible pour stage PFA — 2 mois',
  socials: [
    { name: 'GitHub',   url: 'https://github.com/souli-mathieu',   icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/mathieu-souli', icon: 'linkedin' },
  ]
}

export const skills = [
  {
    category: 'Frontend',
    icon: '⬡',
    items: [
      { name: 'Vue.js',      level: 85 },
      { name: 'JavaScript',  level: 80 },
      { name: 'HTML/CSS',    level: 90 },
      { name: 'QGIS',        level: 75 },
    ]
  },
  {
    category: 'Backend',
    icon: '◈',
    items: [
      { name: 'PHP',         level: 72 },
      { name: 'MySQL',       level: 70 },
      { name: 'REST API',    level: 68 },
      { name: 'Node.js',     level: 55 },
    ]
  },
  {
    category: 'Outils & Méthodes',
    icon: '◆',
    items: [
      { name: 'Git / GitHub', level: 80 },
      { name: 'Figma',        level: 65 },
      { name: 'QGIS / SIG',   level: 78 },
      { name: 'Agile / Scrum',level: 60 },
    ]
  }
]

export const projects = [
  {
    id: 1,
    title: 'Water Credit AI',
    subtitle: 'Hackathon Water4Future 2026',
    description: `Système d'allocation durable de l'eau basé sur des crédits échangeables, l'analyse satellite (NDVI/NDWI) et des recommandations agricoles par IA. Développé lors du hackathon UNESCO ICIREWARD à Montpellier en équipe "Géoinfo 2".`,
    image: null,
    color: '#1a2a1a',
    accentColor: '#4a9b6a',
    technologies: ['Python', 'Remote Sensing', 'AI/ML', 'NDVI/NDWI', 'Vue.js'],
    github: 'https://github.com/souli-mathieu/water-credit-ai',
    demo: null,
    featured: true,
    award: '🏆 Hackathon UNESCO 2026',
    year: '2026'
  },
  {
    id: 2,
    title: 'Atlas Cartographique',
    subtitle: 'Casablanca-Settat Region',
    description: `Atlas cartographique complet de la région Casablanca-Settat (Maroc) réalisé avec QGIS, Philcarto et Phildigit. Visualisation des données démographiques, économiques et sociales du RGPH HCP selon la sémiologie de Bertin.`,
    image: null,
    color: '#1a1a2a',
    accentColor: '#c49b53',
    technologies: ['QGIS', 'Philcarto', 'Phildigit', 'SIG', 'Cartographie'],
    github: 'https://github.com/souli-mathieu/atlas-casablanca-settat',
    demo: null,
    featured: true,
    award: null,
    year: '2025-2026'
  },
  {
    id: 3,
    title: 'Portfolio Interactif',
    subtitle: 'Site personnel',
    description: `Portfolio professionnel développé avec Vue.js 3 (Composition API), design system custom, animations CSS avancées, entièrement responsive et optimisé SEO.`,
    image: null,
    color: '#1a1515',
    accentColor: '#c44f4f',
    technologies: ['Vue.js 3', 'CSS3', 'Vite', 'JavaScript'],
    github: 'https://github.com/souli-mathieu/portfolio',
    demo: '#',
    featured: false,
    award: null,
    year: '2026'
  }
]

export const experience = [
  {
    type: 'education',
    period: '2025 — Présent',
    title: 'Cycle Ingénieur – Géoinformation',
    org: 'FST de Tanger · Université Abdelmalek Essaâdi',
    location: 'Tanger, Maroc',
    description: "Formation d'ingénieur spécialisée en SIG, télédétection, Geo IA, Big Data et bases de données spatiales (PostGIS).",
    tags: ['SIG', 'Télédétection', 'Geo IA', 'Big Data', 'PostGIS'],
    highlight: true
  },
  {
    type: 'education',
    period: '2022 — 2024',
    title: 'DEUST – Mathématiques · Informatique · Physique (MIP)',
    org: 'FST de Béni Mellal',
    location: 'Béni Mellal, Maroc',
    description: 'Formation scientifique en mathématiques, informatique et physique.',
    tags: ['Mathématiques', 'Informatique', 'Physique', 'Algorithmique'],
    highlight: false
  },
  {
    type: 'education',
    period: '2021 — 2022',
    title: 'Baccalauréat série D',
    org: 'Complexe Scolaire Horizon International',
    location: 'Ouagadougou, Burkina Faso',
    description: 'Baccalauréat scientifique série D.',
    tags: ['Sciences', 'Mathématiques', 'Burkina Faso'],
    highlight: false
  }
]

export const stats = [
  { value: '3+', label: 'Projets réalisés' },
  { value: '4', label: 'Technologies maîtrisées' },
  { value: '1', label: 'Hackathon international' },
  { value: '2+', label: 'Certifications' },
]
