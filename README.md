# Portfolio SOULI Mathieu - Projet Complet

## 📋 Vue d'ensemble

Ce projet contient un portfolio professionnel complet avec système d'administration back-office, développé avec Vue.js 3 et Supabase.

## 📁 Structure du projet

```
Portfolio_V2/
├── portfolio-final/          # Application portfolio (frontend)
├── backoffice-final/         # Application d'administration
├── portfolio_v2_complet.html # Version HTML statique complète
├── supabase_schema_v2.sql    # Schéma de base de données
└── README.md                 # Ce fichier
```

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
# Portfolio
cd portfolio-final
npm install

# Back-office
cd ../backoffice-final
npm install
```

### 2. Configuration de l'environnement

Les variables d'environnement sont déjà configurées avec les clés Supabase :

- `portfolio-final/.env.local` ✅ Configuré
- `backoffice-final/.env.local` ✅ Configuré

### 3. Lancement des applications

```bash
# Portfolio (port 5173)
cd portfolio-final
npm run dev

# Back-office (port 5174)
cd backoffice-final
npm run dev
```

### 4. Build pour production

```bash
# Portfolio
cd portfolio-final
npm run build

# Back-office
cd backoffice-final
npm run build
```

## 🗄️ Base de données Supabase

Le schéma de la base de données est défini dans `supabase_schema_v2.sql`.

### Tables principales :
- `profile` : Informations personnelles
- `skills` : Compétences
- `projects` : Projets
- `experience` : Expériences professionnelles
- `messages` : Messages du formulaire de contact

## 🎨 Fonctionnalités

### Portfolio
- Interface moderne et responsive
- Sections : Hero, About, Skills, Projects, Experience, Contact
- Animations fluides
- Design cyberpunk/tech

### Back-office
- Dashboard avec statistiques
- Gestion des profils
- Gestion des projets
- Gestion des compétences
- Gestion des expériences
- Messages du formulaire de contact
- Authentification sécurisée

## 🛠️ Technologies utilisées

- **Frontend** : Vue.js 3, Vite
- **Routing** : Vue Router 4
- **State Management** : Pinia
- **Database** : Supabase
- **Styling** : CSS3 avec variables personnalisées
- **Icons** : SVG intégrés
- **Maps** : Leaflet (pour la section contact)

## 📱 Déploiement

### Vercel (recommandé)
1. Connecter votre compte GitHub à Vercel
2. Importer les deux dépôts séparément
3. Configurer les variables d'environnement dans Vercel
4. Déployer automatiquement

### Netlify
1. Build command : `npm run build`
2. Publish directory : `dist`
3. Configurer les variables d'environnement

## 🔧 Configuration Supabase

Si vous utilisez votre propre projet Supabase :

1. Créer un nouveau projet sur [supabase.com](https://supabase.com)
2. Exécuter le script `supabase_schema_v2.sql` dans l'éditeur SQL
3. Copier les clés depuis Settings > API
4. Mettre à jour les fichiers `.env.local`

## 📸 Cloudinary (optionnel)

Pour l'upload d'images dans le back-office :

1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Dashboard > Settings > Upload > Add upload preset (mode: Unsigned)
3. Ajouter les variables d'environnement :
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

## 🐛 Dépannage

### Problèmes courants
- **Erreur 404** : Vérifiez que les variables d'environnement sont correctes
- **Build échoue** : Assurez-vous que toutes les dépendances sont installées
- **Connexion Supabase** : Vérifiez les clés API et les permissions RLS

### Logs utiles
```bash
# Vérifier les erreurs de build
npm run build -- --mode production

# Lancer avec logs détaillés
npm run dev -- --debug
```

## 📞 Support

Pour toute question ou problème :
- Vérifier la console du navigateur
- Consulter les logs Supabase
- Vérifier la configuration des variables d'environnement

---
*Développé avec ❤️ par SOULI Mathieu*
