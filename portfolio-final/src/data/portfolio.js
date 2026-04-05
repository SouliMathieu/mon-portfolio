// ============================================
// PORTFOLIO DATA — SOULI MATHIEU
// ============================================

export const profile = {
  name: 'SOULI MATHIEU',
  firstName: 'Mathieu',
  lastName: 'Souli',
  title: 'Développeur Web',
  subtitle: 'Full Stack — Vue.js · PHP · MySQL',
  tagline: 'Je conçois des interfaces élégantes et des architectures robustes.',
  bio: `Étudiant ingénieur en Géoinformation à la FST de Tanger, je combine rigueur scientifique et créativité technique pour construire des applications web performantes. Passionné par la cartographie, la data et l'UX, je transforme les données complexes en expériences digitales claires et engageantes.`,
  location: 'Tanger, Maroc',
  email: 'souli.mathieu@email.com',
  phone: '+212 6XX XXX XXX',
  availability: 'Disponible pour stage / alternance',
  socials: [
    { name: 'GitHub',   url: 'https://github.com/souli-mathieu',   icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/souli-mathieu', icon: 'linkedin' },
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
    period: '2023 — Présent',
    title: 'Cycle Ingénieur Géoinformation',
    org: 'FST Tanger',
    location: 'Tanger, Maroc',
    description: 'Formation d\'ingénieur spécialisée en systèmes d\'information géographique, cartographie numérique, développement web et analyse spatiale.',
    tags: ['SIG', 'Cartographie', 'Développement Web', 'Analyse Spatiale'],
    highlight: true
  },
  {
    type: 'achievement',
    period: 'Mars 2026',
    title: 'Water4Future Hackathon',
    org: 'UNESCO ICIREWARD',
    location: 'Montpellier, France',
    description: 'Développement du projet Water Credit AI — système d\'allocation durable de l\'eau combinant satellites, crédits échangeables et IA agricole.',
    tags: ['Hackathon', 'IA', 'Remote Sensing', 'Innovation'],
    highlight: true
  },
  {
    type: 'certification',
    period: '2025',
    title: 'Going Places with Spatial Analysis',
    org: 'Esri MOOC',
    location: 'En ligne',
    description: 'Certification Esri sur l\'analyse spatiale avancée, interpolation, statistiques spatiales et modélisation géographique.',
    tags: ['Esri', 'ArcGIS', 'Analyse Spatiale', 'MOOC'],
    highlight: false
  },
  {
    type: 'education',
    period: '2020 — 2023',
    title: 'Classes Préparatoires — CPGE',
    org: 'Lycée technique',
    location: 'Maroc',
    description: 'Formation scientifique intensive en mathématiques, physique, informatique. Développement de la rigueur analytique et des capacités de résolution de problèmes complexes.',
    tags: ['Mathématiques', 'Physique', 'Algorithmique'],
    highlight: false
  }
]

export const stats = [
  { value: '3+', label: 'Projets réalisés' },
  { value: '4', label: 'Technologies maîtrisées' },
  { value: '1', label: 'Hackathon international' },
  { value: '2+', label: 'Certifications' },
]
