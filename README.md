# FormationPlace - Marketplace de Formations en Ligne

Marketplace de formations en ligne permettant aux formateurs de vendre leurs formations et aux apprenants d'acheter des formations de qualité.

## 🎨 Design

Ce projet utilise le template **Comercio** adapté pour une marketplace de formations, en conservant 100% du style visuel original (couleurs, polices, espacements, animations, sliders, carrousels).

## 🚀 Fonctionnalités

### Pour les Acheteurs
- Parcourir les formations par catégories
- Rechercher des formations
- Consulter les détails des formations et les avis
- Ajouter des formations au panier
- Acheter des formations via SumUp
- Laisser des avis après achat

### Pour les Formateurs/Vendeurs
- Créer un profil formateur complet
- Ajouter et gérer des formations
- Fixer les prix et promotions
- Suivre les ventes et revenus (90% du prix après commission)
- Recevoir les paiements

### Système
- Paiements sécurisés via SumUp
- Commission plateforme de 10% (paramétrable)
- Système d'avis et de notes
- Gestion du panier
- Responsive design (mobile, tablette, desktop)

## 📋 Prérequis

- Node.js 18+ installé
- Un compte GitHub
- Un compte Vercel (gratuit)
- Une base de données PostgreSQL hébergée (Supabase / Neon / Vercel Postgres)
- Un compte SumUp pour les paiements

## 🛠️ Installation Locale

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/formationplace.git
cd formationplace
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

Puis éditer `.env` avec vos vraies valeurs :
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-genere
SUMUP_API_KEY=votre-cle-sumup
SUMUP_MERCHANT_CODE=votre-code-marchand
NEXT_PUBLIC_SUMUP_MERCHANT_CODE=votre-code-marchand
PLATFORM_COMMISSION=10
```

4. **Créer la base de données**
Exécuter le script SQL sur votre base PostgreSQL :
```bash
# Connectez-vous à votre base de données et exécutez :
psql $DATABASE_URL < database/schema.sql
```

5. **Lancer en développement**
```bash
npm run dev
```

Le site sera accessible sur http://localhost:3000

## 🌐 Déploiement sur Vercel

### Étape 1 : Créer la base de données en ligne

**Option A : Vercel Postgres** (recommandé)
1. Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquer sur "Storage" > "Create Database" > "Postgres"
3. Copier la variable `DATABASE_URL` fournie

**Option B : Supabase**
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Dans "Project Settings" > "Database", copier l'URL de connexion
4. Aller dans "SQL Editor" et exécuter le contenu de `database/schema.sql`

**Option C : Neon**
1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet
3. Copier la connexion string
4. Exécuter le script SQL via leur interface

### Étape 2 : Pousser le code sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - FormationPlace"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/votre-username/formationplace.git
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. **Se connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter avec GitHub

2. **Importer le projet**
   - Cliquer sur "Add New Project"
   - Sélectionner votre repository GitHub `formationplace`
   - Cliquer sur "Import"

3. **Configurer les variables d'environnement**
   Dans la section "Environment Variables", ajouter :

   ```
   DATABASE_URL = postgresql://... (votre URL de base de données)
   NEXTAUTH_URL = https://votre-projet.vercel.app
   NEXTAUTH_SECRET = (générer un secret aléatoire)
   SUMUP_API_KEY = votre-cle-sumup
   SUMUP_MERCHANT_CODE = votre-code-marchand
   NEXT_PUBLIC_SUMUP_MERCHANT_CODE = votre-code-marchand
   PLATFORM_COMMISSION = 10
   NEXT_PUBLIC_SITE_URL = https://votre-projet.vercel.app
   ```

   **Pour générer NEXTAUTH_SECRET :**
   ```bash
   openssl rand -base64 32
   ```

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre la fin du build (2-3 minutes)
   - Votre site sera en ligne ! 🎉

### Étape 4 : Configuration SumUp

1. Créer un compte marchand sur [SumUp](https://www.sumup.com)
2. Activer l'API dans les paramètres développeur
3. Copier votre API Key et Merchant Code
4. Les ajouter dans les variables d'environnement Vercel

### Étape 5 : Copier les assets du template

1. **Télécharger le template Comercio**
   - Télécharger les fichiers CSS, JS et images du template original

2. **Copier dans le projet**
   ```
   /public/assets/
     ├── css/
     │   ├── bootstrap.min.css
     │   ├── app.css
     │   ├── ... (tous les CSS)
     ├── js/
     │   ├── jquery.min.js
     │   ├── app.js
     │   ├── ... (tous les JS)
     ├── img/
     │   ├── logo.png
     │   ├── logo2.png
     │   ├── slider/
     │   ├── banners/
     │   └── ... (toutes les images)
   ```

3. **Créer `pages/_document.js` pour inclure les CSS/JS**
   ```javascript
   import { Html, Head, Main, NextScript } from 'next/document'

   export default function Document() {
     return (
       <Html lang="fr">
         <Head>
           <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
           <link rel="stylesheet" href="/assets/css/fontawesome-all.min.css" />
           <link rel="stylesheet" href="/assets/css/owl.carousel.min.css" />
           <link rel="stylesheet" href="/assets/css/animate.css" />
           <link rel="stylesheet" href="/assets/css/slick.css" />
           <link rel="stylesheet" href="/assets/css/app.css" />
         </Head>
         <body>
           <Main />
           <NextScript />
           <script src="/assets/js/jquery.min.js"></script>
           <script src="/assets/js/bootstrap.min.js"></script>
           <script src="/assets/js/owl.carousel.min.js"></script>
           <script src="/assets/js/slick.js"></script>
           <script src="/assets/js/app.js"></script>
         </body>
       </Html>
     )
   }
   ```

## 📁 Structure du Projet

```
formationplace/
├── components/           # Composants React réutilisables
│   ├── Header.js        # En-tête du site
│   ├── Footer.js        # Pied de page
│   └── FormationCard.js # Carte de formation
├── pages/               # Pages Next.js
│   ├── index.js         # Page d'accueil
│   ├── formations/
│   │   └── [slug].js    # Détail d'une formation
│   ├── formateurs/
│   │   └── [id].js      # Profil formateur
│   ├── api/             # API Routes
│   └── _document.js     # Document HTML personnalisé
├── public/              # Fichiers statiques
│   └── assets/          # Assets du template Comercio
│       ├── css/
│       ├── js/
│       └── img/
├── database/            # Schéma de base de données
│   └── schema.sql       # Script SQL
├── .env.example         # Variables d'environnement exemple
├── next.config.js       # Configuration Next.js
├── package.json         # Dépendances
└── README.md           # Ce fichier
```

## 🗄️ Base de Données

### Tables principales

- **users** : Tous les utilisateurs (acheteurs et vendeurs)
- **seller_profiles** : Profils des formateurs
- **formations** : Les formations
- **categories** : Catégories de formations
- **orders** : Commandes
- **order_items** : Détails des commandes
- **reviews** : Avis et notes
- **cart** : Panier d'achat
- **seller_payouts** : Paiements aux vendeurs
- **subscriptions** : Abonnements (futur)

Voir `database/schema.sql` pour le schéma complet.

## 🔑 Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | ✅ |
| `NEXTAUTH_URL` | URL du site | ✅ |
| `NEXTAUTH_SECRET` | Secret pour NextAuth | ✅ |
| `SUMUP_API_KEY` | Clé API SumUp | ✅ |
| `SUMUP_MERCHANT_CODE` | Code marchand SumUp | ✅ |
| `NEXT_PUBLIC_SUMUP_MERCHANT_CODE` | Code marchand (public) | ✅ |
| `PLATFORM_COMMISSION` | Commission en % (défaut: 10) | ❌ |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | ❌ |

## 🎯 Prochaines Étapes

### Backend (API Routes à créer)

1. **Authentification** (`/api/auth/`)
   - Inscription
   - Connexion
   - Gestion des sessions

2. **Formations** (`/api/formations/`)
   - Liste des formations
   - Détails d'une formation
   - Créer/modifier/supprimer (vendeurs)

3. **Panier** (`/api/cart/`)
   - Ajouter au panier
   - Supprimer du panier
   - Récupérer le panier

4. **Paiement** (`/api/checkout/`)
   - Créer une session SumUp
   - Valider le paiement
   - Créer la commande

5. **Avis** (`/api/reviews/`)
   - Laisser un avis
   - Récupérer les avis

### Frontend

1. Ajouter les interactions JavaScript (sliders, filtres, etc.)
2. Implémenter le panier dynamique
3. Créer les pages manquantes (liste formations, panier, checkout, etc.)
4. Ajouter la gestion d'état (Context API ou Redux)

## 📞 Support

Pour toute question :
- Email : support@formationplace.com
- Documentation : [docs.formationplace.com](https://docs.formationplace.com)

## 📄 Licence

Propriétaire - Tous droits réservés

---

**FormationPlace** - Développez vos compétences, partagez votre expertise 🚀
