# 🚀 GUIDE DE DÉMARRAGE RAPIDE - FORMATIONPLACE

## ⚡ En 5 Minutes Chrono

### 1️⃣ Installer les dépendances

```bash
cd C:\Users\leroy\Desktop\testsite
npm install
```

### 2️⃣ Configurer les variables d'environnement

Copier `.env.example` vers `.env` :

```bash
copy .env.example .env
```

Puis éditer `.env` avec vos valeurs (temporaires pour le dev local) :

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/formationplace
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=secret-temporaire-local
SUMUP_API_KEY=sk_test_...
SUMUP_MERCHANT_CODE=MXXX
NEXT_PUBLIC_SUMUP_MERCHANT_CODE=MXXX
PLATFORM_COMMISSION=10
```

### 3️⃣ Créer la base de données locale (optionnel)

Si vous voulez tester en local avec PostgreSQL :

```bash
# Installer PostgreSQL localement
# Puis créer la base de données :
psql -U postgres -c "CREATE DATABASE formationplace;"

# Exécuter le schéma :
psql -U postgres -d formationplace < database/schema.sql
```

### 4️⃣ Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📦 CE QUI A ÉTÉ CRÉÉ

### ✅ Fichiers de Configuration
- `package.json` - Dépendances Next.js, React, PostgreSQL, etc.
- `next.config.js` - Configuration Next.js pour Vercel
- `.env.example` - Template des variables d'environnement
- `.gitignore` - Fichiers à ignorer par Git

### ✅ Base de Données
- `database/schema.sql` - Schéma PostgreSQL complet avec :
  - 10 tables (users, formations, orders, reviews, etc.)
  - Triggers automatiques pour les notes moyennes
  - Index pour les performances
  - Données de test

### ✅ Composants React
- `components/Header.js` - Menu adapté aux formations
- `components/Footer.js` - Pied de page adapté
- `components/FormationCard.js` - Carte de formation réutilisable

### ✅ Pages Next.js
- `pages/index.js` - Page d'accueil complète (slider, grilles, bannières)
- `pages/formations/[slug].js` - Page détail d'une formation
- `pages/formateurs/[id].js` - Page profil formateur

### ✅ Documentation
- `README.md` - Documentation complète du projet
- `PROMPT_RECAP_COMPLET.md` - Résumé technique complet
- `API_ROUTES_STRUCTURE.md` - Structure détaillée des API à développer
- `GUIDE_DEMARRAGE_RAPIDE.md` - Ce fichier

---

## ❌ CE QUI RESTE À FAIRE

### 1. Copier les Assets du Template Comercio

**Télécharger le template :**
1. Télécharger le template Comercio original
2. Extraire tous les fichiers

**Copier dans le projet :**
```
C:\Users\leroy\Desktop\testsite\public\assets\
├── css\
│   ├── bootstrap.min.css
│   ├── fontawesome-all.min.css
│   ├── owl.carousel.min.css
│   ├── animate.css
│   ├── slick.css
│   └── app.css
├── js\
│   ├── jquery.min.js
│   ├── bootstrap.min.js
│   ├── owl.carousel.min.js
│   ├── slick.js
│   └── app.js
└── img\
    ├── logo.png
    ├── logo2.png
    ├── slider\
    ├── banners\
    └── ...
```

### 2. Créer `pages/_document.js`

Créer le fichier suivant pour charger les CSS/JS du template :

```javascript
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* CSS du template Comercio */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome-all.min.css" />
        <link rel="stylesheet" href="/assets/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/css/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/assets/css/flaticon.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/jquery-ui.css" />
        <link rel="stylesheet" href="/assets/css/venobox.css" />
        <link rel="stylesheet" href="/assets/css/slick.css" />
        <link rel="stylesheet" href="/assets/css/app.css" />
      </Head>
      <body id="home-version-1" className="home-version-1" data-style="default">
        <Main />
        <NextScript />

        {/* JS du template Comercio */}
        <script src="/assets/js/jquery.min.js"></script>
        <script src="/assets/js/popper.min.js"></script>
        <script src="/assets/js/bootstrap.min.js"></script>
        <script src="/assets/js/owl.carousel.min.js"></script>
        <script src="/assets/js/wow.min.js"></script>
        <script src="/assets/js/isotope.pkgd.min.js"></script>
        <script src="/assets/js/imagesloaded.pkgd.min.js"></script>
        <script src="/assets/js/jquery.countdown.min.js"></script>
        <script src="/assets/js/venobox.min.js"></script>
        <script src="/assets/js/slick.js"></script>
        <script src="/assets/js/headroom.js"></script>
        <script src="/assets/js/jquery-ui.min.js"></script>
        <script src="/assets/js/app.js"></script>
      </body>
    </Html>
  )
}
```

### 3. Développer les API Routes

Suivre la structure décrite dans `API_ROUTES_STRUCTURE.md` pour créer :
- `/api/auth/*` - Authentification
- `/api/formations/*` - Gestion des formations
- `/api/cart/*` - Panier
- `/api/checkout/*` - Paiement SumUp
- `/api/reviews/*` - Avis
- `/api/orders/*` - Commandes

### 4. Créer les Pages Manquantes

- `/pages/formations/index.js` - Liste de toutes les formations avec filtres
- `/pages/categories/[slug].js` - Formations par catégorie
- `/pages/panier.js` - Page panier
- `/pages/checkout.js` - Page de paiement
- `/pages/login.js` - Page de connexion
- `/pages/register.js` - Page d'inscription
- `/pages/dashboard/*` - Dashboard vendeur
- `/pages/account/*` - Compte acheteur

### 5. Connecter le Frontend au Backend

Utiliser `fetch` ou `axios` pour appeler les API :

```javascript
// Exemple : Récupérer les formations
const response = await fetch('/api/formations?filter=populaires');
const data = await response.json();
```

---

## 🌐 DÉPLOYER SUR VERCEL

### Étape 1 : Créer une base de données en ligne

**Option recommandée : Vercel Postgres**
1. Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Storage → Create Database → Postgres
3. Copier la `DATABASE_URL`
4. Aller dans "Query" et exécuter le contenu de `database/schema.sql`

### Étape 2 : Pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - FormationPlace"
git remote add origin https://github.com/VOTRE-USERNAME/formationplace.git
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Se connecter à [vercel.com](https://vercel.com)
2. "Add New Project" → Importer votre repo GitHub
3. Configurer les variables d'environnement :
   ```
   DATABASE_URL = postgresql://...
   NEXTAUTH_URL = https://votre-projet.vercel.app
   NEXTAUTH_SECRET = (générer avec: openssl rand -base64 32)
   SUMUP_API_KEY = votre-cle-sumup
   SUMUP_MERCHANT_CODE = votre-code-marchand
   NEXT_PUBLIC_SUMUP_MERCHANT_CODE = votre-code-marchand
   PLATFORM_COMMISSION = 10
   NEXT_PUBLIC_SITE_URL = https://votre-projet.vercel.app
   ```
4. Cliquer sur "Deploy"
5. Attendre 2-3 minutes
6. Votre site est en ligne ! 🎉

---

## 🎯 ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

### Phase 1 : Assets et Design (1-2h)
1. ✅ Copier les assets du template dans `/public/assets/`
2. ✅ Créer `pages/_document.js`
3. ✅ Tester que le design s'affiche correctement

### Phase 2 : Authentification (3-4h)
1. Créer `/api/auth/[...nextauth].js`
2. Créer `/pages/login.js`
3. Créer `/pages/register.js`
4. Tester l'inscription et la connexion

### Phase 3 : Formations (5-6h)
1. Créer `/api/formations/index.js` (GET, POST)
2. Créer `/api/formations/[id].js` (GET, PUT, DELETE)
3. Créer `/pages/formations/index.js` (liste)
4. Connecter le frontend aux API
5. Tester la création/modification de formations

### Phase 4 : Panier et Paiement (6-8h)
1. Créer `/api/cart/*`
2. Créer `/pages/panier.js`
3. Créer `/api/checkout/*`
4. Intégrer SumUp
5. Créer `/pages/checkout.js`
6. Tester le flux complet d'achat

### Phase 5 : Avis et Reviews (2-3h)
1. Créer `/api/reviews/*`
2. Ajouter formulaire d'avis sur la page formation
3. Tester la création d'avis et le calcul automatique des notes

### Phase 6 : Dashboard Vendeur (4-5h)
1. Créer `/pages/dashboard/index.js`
2. Créer `/pages/dashboard/formations.js`
3. Créer `/pages/dashboard/stats.js`
4. Afficher les statistiques du vendeur

### Phase 7 : Optimisations et Tests (3-4h)
1. Ajouter la pagination
2. Optimiser les requêtes SQL
3. Ajouter la gestion d'erreurs
4. Tests complets
5. Déploiement final sur Vercel

**TOTAL ESTIMÉ : 25-35 heures de développement**

---

## 📞 BESOIN D'AIDE ?

### Ressources Utiles

**Next.js :**
- [Documentation Next.js](https://nextjs.org/docs)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Déploiement Vercel](https://vercel.com/docs)

**PostgreSQL :**
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [node-postgres (pg)](https://node-postgres.com/)

**SumUp :**
- [Documentation API SumUp](https://developer.sumup.com/docs/)
- [Checkout API](https://developer.sumup.com/docs/api/checkout-api)

**NextAuth :**
- [Documentation NextAuth](https://next-auth.js.org/)

### Structure du Projet

Tous les fichiers sont prêts dans :
```
C:\Users\leroy\Desktop\testsite\
```

### Fichiers Importants

- 📖 `README.md` - Documentation complète
- 📋 `PROMPT_RECAP_COMPLET.md` - Résumé technique complet
- 🔌 `API_ROUTES_STRUCTURE.md` - Structure des API
- ⚡ `GUIDE_DEMARRAGE_RAPIDE.md` - Ce fichier

---

## ✅ CHECKLIST AVANT DE CODER

- [ ] Assets du template copiés dans `/public/assets/`
- [ ] `pages/_document.js` créé
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Base de données créée (locale ou en ligne)
- [ ] Schéma SQL exécuté (`database/schema.sql`)
- [ ] `npm install` exécuté
- [ ] `npm run dev` fonctionne
- [ ] La page d'accueil s'affiche correctement

---

**🎉 Vous êtes prêt à développer FormationPlace !**

Bon courage et n'hésitez pas à vous référer aux différents fichiers de documentation. 🚀

---

**FormationPlace** - Développez vos compétences, partagez votre expertise 💡
