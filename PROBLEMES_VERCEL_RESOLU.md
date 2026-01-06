# 🔧 Problèmes Vercel Résolus - FormationPlace

## ❌ Problème Principal

**Symptôme :** Le site fonctionne en localhost mais sur Vercel :
- Pas de CSS (HTML brut)
- Menu non stylisé (liste à puces)
- Images ne chargent pas
- Aucun JavaScript

## 🔍 Analyse des Causes

### 1. **PROBLÈME PRINCIPAL : vercel.json mal configuré**

#### ❌ Configuration INCORRECTE (avant) :
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
  "env": { ... }
}
```

**Problèmes identifiés :**

1. **`rewrites` cassait le routing Next.js**
   - `"source": "/(.*)"` redirigeait TOUTES les requêtes vers "/"
   - Résultat : `/formations`, `/contact`, etc. → redirigés vers la homepage
   - Les fichiers CSS/JS Next.js (dans `/_next/`) étaient aussi redirigés
   - **C'est LA cause principale du CSS qui ne charge pas**

2. **Commandes inutiles pour Next.js**
   - `buildCommand`, `devCommand`, `installCommand` : Vercel détecte automatiquement Next.js
   - Ces commandes peuvent créer des conflits
   - Next.js a sa propre configuration de build

3. **Variables d'environnement mal placées**
   - Les `env` avec `@` doivent être configurées dans Vercel Dashboard, pas dans vercel.json
   - Format `"@database_url"` = référence à un secret Vercel
   - Doit être configuré dans : Vercel Dashboard → Project → Settings → Environment Variables

#### ✅ Configuration CORRECTE (après) :
```json
{
  "framework": "nextjs"
}
```

**Pourquoi c'est mieux :**
- Vercel détecte automatiquement Next.js
- Pas de rewrites = routing Next.js fonctionne normalement
- CSS/JS chargent correctement depuis `/_next/`
- Variables d'env gérées dans le Dashboard

---

## ✅ Solutions Appliquées

### Solution 1 : Simplifier vercel.json

**Fichier `vercel.json` corrigé :**
```json
{
  "framework": "nextjs"
}
```

C'est TOUT ce dont vous avez besoin ! Vercel fait le reste automatiquement.

---

### Solution 2 : Configurer les variables d'environnement dans Vercel Dashboard

**Étapes :**
1. Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique sur ton projet FormationPlace
3. Settings → Environment Variables
4. Ajoute chaque variable :

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.pizavxricwbbrbcovqzi.supabase.co:5432/postgres
NEXTAUTH_SECRET = [ton_secret_aleatoire_32_caracteres]
NEXTAUTH_URL = https://ton-site.vercel.app
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = ton_email@gmail.com
SMTP_PASSWORD = ton_mot_de_passe_app
SMTP_FROM = noreply@formationplace.com
```

**Important :** Sélectionne "Production", "Preview" et "Development" pour chaque variable.

---

## 📋 Checklist Complète de Déploiement Vercel

### ✅ Avant de déployer

#### 1. Vérifier la structure des fichiers
- [ ] `pages/_app.js` existe et importe `globals.css`
- [ ] `pages/_document.js` existe (optionnel mais recommandé)
- [ ] `tailwind.config.js` pointe vers les bons dossiers
- [ ] `postcss.config.js` existe
- [ ] Fichiers CSS dans `styles/` (pas dans `public/`)

#### 2. Vérifier package.json
- [ ] Scripts présents : `"build": "next build"`, `"start": "next start"`
- [ ] Dépendances installées : `tailwindcss`, `postcss`, `autoprefixer`
- [ ] Version de Next.js compatible (14+)

#### 3. Vérifier les imports
- [ ] Imports CSS : chemins relatifs depuis `_app.js` (`'../styles/globals.css'`)
- [ ] Imports de composants : chemins relatifs corrects
- [ ] Pas de casse incorrecte (Linux est case-sensitive)

#### 4. Build local
```bash
npm run build
```
- [ ] Build réussit sans erreur
- [ ] Pas de warnings Tailwind critiques
- [ ] Tester avec `npm start` pour voir la version de prod

---

### ✅ Configuration Vercel

#### 1. vercel.json minimaliste
```json
{
  "framework": "nextjs"
}
```
- [ ] Pas de `rewrites` inutiles
- [ ] Pas de `buildCommand` personnalisé (sauf besoin spécifique)
- [ ] Pas de variables d'env ici (les mettre dans Dashboard)

#### 2. Variables d'environnement
Dans Vercel Dashboard → Settings → Environment Variables :
- [ ] `DATABASE_URL` configurée
- [ ] `NEXTAUTH_SECRET` configurée (générer avec `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` = URL de production
- [ ] Variables SMTP configurées
- [ ] Toutes sélectionnées pour Production + Preview + Development

#### 3. Build & Output Settings (Vercel Dashboard)
Normalement détecté automatiquement, mais vérifier :
- [ ] Framework Preset : **Next.js**
- [ ] Build Command : `next build` (ou vide pour auto-detect)
- [ ] Output Directory : `.next` (ou vide pour auto-detect)
- [ ] Install Command : `npm install` (ou vide pour auto-detect)

---

### ✅ Après déploiement

#### 1. Vérifier le déploiement
- [ ] Build logs : pas d'erreurs
- [ ] CSS charge correctement (inspecter avec DevTools)
- [ ] Fonts Google chargent
- [ ] Icônes Phosphor s'affichent
- [ ] Navigation fonctionne (toutes les pages)

#### 2. Tester les fonctionnalités
- [ ] Toutes les pages chargent
- [ ] Sélecteur de devise fonctionne
- [ ] Recherche fonctionne
- [ ] Menu mobile fonctionne
- [ ] Liens fonctionnent

#### 3. Console DevTools
- [ ] Pas d'erreurs 404 sur CSS/JS
- [ ] Pas d'erreurs CORS
- [ ] Pas d'erreurs de fonts

---

## 🚨 Problèmes Courants & Solutions

### Problème : CSS ne charge pas sur Vercel

**Causes possibles :**
1. ❌ Rewrites dans vercel.json → **SOLUTION : Supprimer les rewrites**
2. ❌ CSS importé dans le mauvais fichier → **SOLUTION : Importer dans `_app.js`**
3. ❌ Chemin CSS incorrect → **SOLUTION : Utiliser chemin relatif `'../styles/globals.css'`**
4. ❌ Build Tailwind échoué → **SOLUTION : Vérifier `tailwind.config.js` content paths**

### Problème : Variables d'environnement non trouvées

**Causes possibles :**
1. ❌ Variables dans vercel.json avec `@` → **SOLUTION : Configurer dans Dashboard**
2. ❌ Variables non déployées → **SOLUTION : Redéployer après ajout des variables**
3. ❌ Mauvais nom de variable → **SOLUTION : Vérifier exactement les noms dans le code**

### Problème : Pages 404 ou routing cassé

**Causes possibles :**
1. ❌ Rewrites incorrects → **SOLUTION : Supprimer rewrites de vercel.json**
2. ❌ Nom de fichier incorrect (casse) → **SOLUTION : Vérifier la casse exacte**
3. ❌ Fichier manquant → **SOLUTION : Vérifier que le fichier existe dans pages/**

### Problème : Fonts ou icônes ne chargent pas

**Causes possibles :**
1. ❌ Bloqué par CSP → **SOLUTION : Vérifier headers Vercel**
2. ❌ Script Phosphor bloqué → **SOLUTION : Utiliser CDN https://unpkg.com**
3. ❌ Google Fonts bloquées → **SOLUTION : Vérifier preconnect dans `_document.js`**

---

## 🎯 Résumé : Pourquoi ça marche maintenant

| Avant (❌ Cassé) | Après (✅ Fonctionne) |
|------------------|----------------------|
| vercel.json avec rewrites | vercel.json minimal |
| Tout redirigé vers "/" | Routing Next.js normal |
| CSS/JS redirigés | CSS/JS chargent depuis /_next/ |
| Variables env dans vercel.json | Variables dans Dashboard |
| Commandes personnalisées | Auto-détection Next.js |

---

## 📝 Commandes utiles

### Tester le build localement
```bash
# Build de production
npm run build

# Démarrer en mode production
npm start

# Ouvrir http://localhost:3000
```

### Redéployer sur Vercel
```bash
# Après commit des changements
git add .
git commit -m "Fix: Configuration Vercel corrigée"
git push origin main

# Vercel déploie automatiquement
```

### Logs de déploiement
1. Va sur [vercel.com](https://vercel.com)
2. Clique sur ton projet
3. Onglet "Deployments"
4. Clique sur le dernier déploiement
5. Onglet "Build Logs" pour voir les logs détaillés

---

## 🎉 Checklist Finale Rapide

Avant chaque déploiement :

```bash
# 1. Build local OK
npm run build
npm start

# 2. Vérifier vercel.json
cat vercel.json
# Devrait contenir seulement: {"framework": "nextjs"}

# 3. Variables d'env configurées dans Dashboard Vercel

# 4. Git push
git add .
git commit -m "Ton message"
git push origin main

# 5. Attendre le déploiement Vercel (2-3 minutes)

# 6. Tester le site en production
```

---

**Date de résolution :** 2025-11-20
**Problème principal résolu :** Rewrites dans vercel.json cassaient le routing et le chargement des assets CSS/JS
