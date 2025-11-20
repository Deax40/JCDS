# ✅ Checklist de Déploiement Vercel - FormationPlace

## 🚀 Avant CHAQUE déploiement

### 1. Test local
```bash
# Build en local
npm run build

# Démarrer en mode production
npm start

# Tester sur http://localhost:3000
```

- [ ] Build réussit sans erreur
- [ ] Pas de warnings critiques
- [ ] Site fonctionne en mode production local
- [ ] CSS charge correctement
- [ ] Navigation fonctionne

---

### 2. Vérifier vercel.json

```bash
cat vercel.json
```

**Doit contenir SEULEMENT :**
```json
{
  "framework": "nextjs"
}
```

- [ ] Pas de `rewrites`
- [ ] Pas de `buildCommand`
- [ ] Pas de `env`
- [ ] Juste `"framework": "nextjs"`

---

### 3. Vérifier les fichiers critiques

#### _app.js
```bash
cat pages/_app.js | grep "globals.css"
```
- [ ] Import `'../styles/globals.css'` présent
- [ ] Imports Swiper CSS présents
- [ ] CurrencyProvider wrappé

#### package.json
- [ ] `"build": "next build"` existe
- [ ] `tailwindcss` dans devDependencies
- [ ] `next` version 14+

---

## 🔧 Configuration Vercel Dashboard

### Variables d'environnement (Settings → Environment Variables)

**À configurer :**
- [ ] `DATABASE_URL` (Supabase connection string)
- [ ] `NEXTAUTH_SECRET` (32 caractères aléatoires)
- [ ] `NEXTAUTH_URL` (URL de production)
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASSWORD`
- [ ] `SMTP_FROM`

**Important :**
- [ ] Chaque variable sélectionnée pour : Production + Preview + Development

### Build Settings (Settings → General)
- [ ] Framework Preset : **Next.js**
- [ ] Build Command : vide (auto-detect)
- [ ] Output Directory : vide (auto-detect)
- [ ] Install Command : vide (auto-detect)

---

## 📤 Déployer

```bash
git add .
git commit -m "Ton message"
git push origin main
```

- [ ] Commit sans conflits
- [ ] Push réussi sur GitHub
- [ ] Attendre 2-3 minutes

---

## ✅ Après déploiement

### 1. Vérifier le build
- [ ] Aller sur vercel.com/dashboard
- [ ] Cliquer sur le projet
- [ ] Onglet "Deployments" → dernier déploiement
- [ ] Status : ✅ Ready
- [ ] Pas d'erreurs dans Build Logs

### 2. Tester le site en production

Ouvrir le site et vérifier :
- [ ] CSS charge (pas de HTML brut)
- [ ] Menu stylisé (pas de liste à puces)
- [ ] Fonts Google chargent
- [ ] Icônes Phosphor s'affichent
- [ ] Navigation fonctionne (toutes les pages)
- [ ] Sélecteur de devise fonctionne
- [ ] Responsive fonctionne (mobile/desktop)

### 3. Console DevTools (F12)

- [ ] Onglet Console : pas d'erreurs rouges
- [ ] Onglet Network : tous les CSS/JS chargent (status 200)
- [ ] Pas d'erreurs 404

---

## 🚨 Si ça ne fonctionne pas

### CSS ne charge pas

1. **Vérifier vercel.json**
   ```json
   {
     "framework": "nextjs"
   }
   ```

2. **Vérifier Build Logs sur Vercel**
   - Chercher erreurs Tailwind
   - Vérifier que build Next.js réussit

3. **Redéployer**
   ```bash
   # Force rebuild
   git commit --allow-empty -m "Force rebuild"
   git push origin main
   ```

### Variables d'env non trouvées

1. **Vérifier Dashboard Vercel**
   - Settings → Environment Variables
   - Toutes présentes ?
   - Production + Preview + Development sélectionnés ?

2. **Redéployer après ajout variables**
   - Vercel ne rebuild pas automatiquement
   - Force un nouveau déploiement (voir ci-dessus)

### Pages 404

1. **Vérifier vercel.json**
   - Pas de `rewrites` !

2. **Vérifier nom des fichiers**
   - Linux est case-sensitive
   - `Contact.js` ≠ `contact.js`

---

## 📝 Notes importantes

### ✅ À FAIRE
- Garder vercel.json minimal
- Variables d'env dans Dashboard
- Tester en local avant push
- Vérifier Build Logs après déploiement

### ❌ À ÉVITER
- Rewrites dans vercel.json (casse tout !)
- Variables d'env dans vercel.json
- Commandes personnalisées sans raison
- Push sans tester en local

---

## 🎯 Checklist Rapide (1 minute)

Avant chaque push :

```bash
# 1. Build local
npm run build && npm start

# 2. Vérifier vercel.json
cat vercel.json
# Doit être: {"framework": "nextjs"}

# 3. Push
git add .
git commit -m "Ton message"
git push origin main

# 4. Attendre déploiement (2-3 min)

# 5. Tester en production
# - CSS OK ?
# - Navigation OK ?
# - Console sans erreurs ?
```

---

**Dernière mise à jour :** 2025-11-20
**Problème principal résolu :** Rewrites dans vercel.json cassaient le routing
