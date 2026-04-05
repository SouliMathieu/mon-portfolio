-- ============================================================
-- PORTFOLIO BACKOFFICE — Supabase Schema v2
-- Ajouter les nouvelles colonnes (si projet existant)
-- OU exécuter entièrement sur un nouveau projet
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Table: profile ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name    text NOT NULL DEFAULT 'Mathieu',
  last_name     text NOT NULL DEFAULT 'SOULI',
  title         text NOT NULL DEFAULT 'Développeur Web',
  subtitle      text,
  tagline       text,
  bio           text,
  location      text,
  email         text,
  phone         text,
  availability  text,
  github_url    text,
  linkedin_url  text,
  photo_url     text,   -- ← URL Cloudinary de la photo de profil
  updated_at    timestamptz DEFAULT now()
);

-- Ajouter photo_url si table profile existe déjà
DO $$ BEGIN
  ALTER TABLE profile ADD COLUMN IF NOT EXISTS photo_url text;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── Table: projects ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         text NOT NULL,
  subtitle      text,
  description   text,
  technologies  text[] DEFAULT '{}',
  github_url    text,   -- ← Lien GitHub
  demo_url      text,   -- ← Lien démo / hébergement
  image_url     text,   -- ← URL Cloudinary de l'image du projet
  image_public_id text, -- ← Public ID Cloudinary (pour suppression)
  color         text DEFAULT '#0a1628',
  accent_color  text DEFAULT '#00d4ff',
  emoji         text DEFAULT '◆',
  award         text,
  year          text,
  featured      boolean DEFAULT false,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Ajouter colonnes si table existe déjà
DO $$ BEGIN
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url text;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_public_id text;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url text;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo_url text;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── Table: skills ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category    text NOT NULL,
  icon        text DEFAULT '◆',
  name        text NOT NULL,
  level       int CHECK (level >= 0 AND level <= 100) DEFAULT 50,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ── Table: experience ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        text CHECK (type IN ('education','achievement','certification','work')) DEFAULT 'education',
  period      text NOT NULL,
  title       text NOT NULL,
  org         text NOT NULL,
  location    text,
  description text,
  tags        text[] DEFAULT '{}',
  highlight   boolean DEFAULT false,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ── Table: messages ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  read       boolean DEFAULT false,
  archived   boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE profile    ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills     ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages   ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating
DROP POLICY IF EXISTS "Auth full access profile"    ON profile;
DROP POLICY IF EXISTS "Auth full access projects"   ON projects;
DROP POLICY IF EXISTS "Auth full access skills"     ON skills;
DROP POLICY IF EXISTS "Auth full access experience" ON experience;
DROP POLICY IF EXISTS "Auth full access messages"   ON messages;
DROP POLICY IF EXISTS "Public read profile"         ON profile;
DROP POLICY IF EXISTS "Public read projects"        ON projects;
DROP POLICY IF EXISTS "Public read skills"          ON skills;
DROP POLICY IF EXISTS "Public read experience"      ON experience;
DROP POLICY IF EXISTS "Public insert messages"      ON messages;

-- Authenticated: accès complet
CREATE POLICY "Auth full access profile"    ON profile    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access projects"   ON projects   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access skills"     ON skills     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access messages"   ON messages   FOR ALL USING (auth.role() = 'authenticated');

-- Public: lecture portfolio
CREATE POLICY "Public read profile"    ON profile    FOR SELECT USING (true);
CREATE POLICY "Public read projects"   ON projects   FOR SELECT USING (true);
CREATE POLICY "Public read skills"     ON skills     FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);

-- Public: envoi de messages (formulaire contact)
CREATE POLICY "Public insert messages" ON messages   FOR INSERT WITH CHECK (true);

-- ── Seed data ────────────────────────────────────────────────
INSERT INTO profile (first_name, last_name, title, subtitle, tagline, bio, location, email, phone, availability, github_url, linkedin_url)
VALUES (
  'Mathieu', 'SOULI',
  'Développeur Web', 'Full Stack — Vue.js · PHP · MySQL',
  'Je transforme les données spatiales en expériences digitales.',
  'Étudiant ingénieur en Géoinformation à la FST de Tanger, je combine rigueur scientifique et créativité technique pour construire des applications web performantes. Passionné par la cartographie, la data et l''UX.',
  'Tanger, Maroc', 'souli.mathieu@email.com', '+212 6XX XXX XXX',
  'Disponible pour stage / alternance 2026',
  'https://github.com/souli-mathieu',
  'https://linkedin.com/in/souli-mathieu'
) ON CONFLICT DO NOTHING;

INSERT INTO projects (title, subtitle, description, technologies, github_url, color, accent_color, emoji, award, year, featured, sort_order)
VALUES
  ('Water Credit AI', 'Hackathon Water4Future 2026',
   'Système d''allocation durable de l''eau basé sur des crédits échangeables, l''analyse satellite (NDVI/NDWI) et des recommandations agricoles par IA.',
   ARRAY['Python','Remote Sensing','AI/ML','Vue.js'],
   'https://github.com/souli-mathieu/water-credit-ai',
   '#0a1628','#00d4ff','💧','🏆 Hackathon UNESCO 2026','2026',true,1),
  ('Atlas Cartographique', 'Casablanca-Settat Region',
   'Atlas cartographique complet de la région Casablanca-Settat réalisé avec QGIS, Philcarto et Phildigit.',
   ARRAY['QGIS','Philcarto','Phildigit','SIG'],
   'https://github.com/souli-mathieu/atlas-casablanca-settat',
   '#0a1628','#1e6fff','🗺️',null,'2025-2026',true,2)
ON CONFLICT DO NOTHING;

INSERT INTO skills (category, icon, name, level, sort_order) VALUES
  ('Frontend','⬡','Vue.js 3',85,1), ('Frontend','⬡','JavaScript',80,2),
  ('Frontend','⬡','HTML/CSS',90,3), ('Frontend','⬡','Vite',75,4),
  ('Backend','◈','PHP',72,5), ('Backend','◈','MySQL',70,6),
  ('Backend','◈','REST API',68,7), ('Backend','◈','Supabase',65,8),
  ('Géomatique SIG','🗺','QGIS 3.40',78,9), ('Géomatique SIG','🗺','Philcarto',80,10),
  ('Géomatique SIG','🗺','Cartographie',82,11), ('Géomatique SIG','🗺','Remote Sensing',65,12)
ON CONFLICT DO NOTHING;

INSERT INTO experience (type, period, title, org, location, description, tags, highlight, sort_order) VALUES
  ('education','2023 — Présent','Cycle Ingénieur Géoinformation','FST Tanger','Tanger, Maroc',
   'Formation d''ingénieur spécialisée en SIG, cartographie numérique et développement web.',
   ARRAY['SIG','Cartographie','Web Dev'],true,1),
  ('achievement','Mars 2026','Water4Future Hackathon','UNESCO ICIREWARD','Montpellier, France',
   'Développement du projet Water Credit AI — allocation durable de l''eau par IA et satellite.',
   ARRAY['Hackathon','IA','Innovation'],true,2),
  ('certification','2025','Going Places with Spatial Analysis','Esri MOOC','En ligne',
   'Certification Esri sur l''analyse spatiale avancée et ArcGIS Online.',
   ARRAY['Esri','ArcGIS','Analyse Spatiale'],false,3)
ON CONFLICT DO NOTHING;
