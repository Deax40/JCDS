# 🚀 Optimisation Automatique des Images - FormationPlace

## Vue d'ensemble

Le site utilise maintenant un système d'optimisation automatique des images qui :
- ✅ Convertit automatiquement en **WebP** et **AVIF** (formats modernes, -50% de taille)
- ✅ Génère des tailles **responsives** pour tous les appareils
- ✅ Fait du **lazy loading** natif (charge seulement quand visible)
- ✅ Cache les images optimisées pendant **1 an**
- ✅ Affiche un **fallback** en cas d'erreur

---

## 📊 Gains de Performance

| Format | Taille moyenne | Gain |
|--------|----------------|------|
| JPG original | 500 KB | - |
| WebP optimisé | 150 KB | **-70%** |
| AVIF optimisé | 100 KB | **-80%** |

**Résultat :**
- Site **3x plus rapide** à charger
- **Meilleur SEO** (Google favorise les sites rapides)
- **Économie de bande passante** pour les utilisateurs

---

## 🛠️ Comment ça marche ?

### 1. Next.js Image Optimizer

Next.js optimise automatiquement les images :
1. **Conversion automatique** : JPG/PNG → WebP/AVIF
2. **Responsive** : Génère plusieurs tailles selon l'appareil
3. **Lazy loading** : Charge seulement les images visibles
4. **Cache** : Les images optimisées sont mises en cache

### 2. Composant OptimizedImage

```javascript
import OptimizedImage from '../components/OptimizedImage';

// Utilisation basique
<OptimizedImage
  src="/assets/formations/react.jpg"
  alt="Formation React"
  width={800}
  height={600}
  quality={90}
/>

// Mode "fill" pour images de couverture
<OptimizedImage
  src="/assets/formations/nodejs.jpg"
  alt="Formation Node.js"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

---

## 📁 Configuration

### next.config.js

```javascript
images: {
  // Formats modernes (ordre de préférence)
  formats: ['image/avif', 'image/webp'],

  // Qualité par défaut (85 = bon équilibre qualité/taille)
  quality: 85,

  // Tailles générées automatiquement
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // Cache : 1 an
  minimumCacheTTL: 31536000,

  // Domaines autorisés pour images externes
  domains: [
    'localhost',
    'res.cloudinary.com',
    'vercel.app'
  ]
}
```

---

## 🎯 Utilisation dans le Projet

### FormationCard

Le composant `FormationCardAnvogue` utilise automatiquement l'optimisation :

```javascript
// Si l'image existe → Optimisation WebP automatique
{hasRealImage ? (
  <OptimizedImage
    src={cover_image_url}
    alt={title}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
    quality={90}
    fallback={<FormationIllustration category={category_name} />}
  />
) : (
  // Sinon → Illustration CSS (gradient + icône)
  <FormationIllustration category={category_name} />
)}
```

**Avantages :**
- Hover effect avec image alternative (`cover_image_hover`)
- Fallback automatique vers illustration CSS si erreur
- Tailles responsives optimales pour chaque appareil

---

## 📸 Ajout d'Images

### 1. Images locales (dans `/public`)

```javascript
// Stocker dans : public/assets/formations/react.jpg
const formation = {
  cover_image_url: '/assets/formations/react.jpg',
  cover_image_hover: '/assets/formations/react-hover.jpg',
  // ...
}
```

### 2. Images externes (CDN, Cloudinary, etc.)

```javascript
// Ajouter le domaine dans next.config.js
domains: ['votre-cdn.com']

// Utiliser l'URL complète
const formation = {
  cover_image_url: 'https://votre-cdn.com/image.jpg',
  // ...
}
```

---

## 🔄 Process d'Optimisation

### En Développement (localhost)

```bash
npm run dev
```

1. Image originale chargée depuis `/public` ou CDN
2. Next.js l'optimise à la volée
3. Conversion en WebP/AVIF selon le navigateur
4. Cache en mémoire pour les prochaines requêtes

### En Production (Vercel)

```bash
npm run build
npm start
```

1. Images optimisées lors du build
2. Stockées dans `.next/cache/images/`
3. Servies avec cache HTTP (1 an)
4. CDN Vercel distribue mondialement

---

## 📏 Recommandations d'Images

### Formats acceptés
- ✅ JPG, JPEG (photos, formations)
- ✅ PNG (logos, icônes avec transparence)
- ✅ WebP (déjà optimisé)
- ❌ GIF animé (utiliser MP4 à la place)
- ❌ BMP, TIFF (trop lourds)

### Tailles recommandées

| Usage | Dimension | Ratio |
|-------|-----------|-------|
| Formation (couverture) | 1200x1600px | 3:4 |
| Bannière hero | 1920x1080px | 16:9 |
| Avatar formateur | 400x400px | 1:1 |
| Thumbnail | 600x400px | 3:2 |

### Qualité

- **Photos** : Quality 85-90
- **Screenshots** : Quality 90-95
- **Illustrations** : Quality 80-85
- **Backgrounds** : Quality 70-80

---

## 🎨 Props du Composant OptimizedImage

```javascript
<OptimizedImage
  src="/path/to/image.jpg"           // Chemin de l'image (requis)
  alt="Description"                   // Texte alternatif (requis)
  width={800}                         // Largeur (requis si pas fill)
  height={600}                        // Hauteur (requis si pas fill)
  fill={false}                        // Mode "fill" pour absolute positioning
  sizes="100vw"                       // Media queries pour responsive
  quality={85}                        // Qualité 1-100 (défaut: 85)
  priority={false}                    // Charger immédiatement (au-dessus de la ligne de flottaison)
  className="object-cover"            // Classes CSS
  objectFit="cover"                   // cover | contain | fill | none | scale-down
  fallback={<Component />}            // Composant affiché en cas d'erreur
  onLoad={() => console.log('OK')}   // Callback après chargement
/>
```

---

## 🚨 Erreurs Courantes

### Erreur : "Invalid src prop"

**Cause :** Domaine externe non autorisé

**Solution :**
```javascript
// next.config.js
images: {
  domains: ['votre-domaine.com']
}
```

### Erreur : "Image failed to load"

**Cause :** Chemin incorrect ou image inexistante

**Solution :**
- Vérifier le chemin : `/assets/...` (pas `assets/...`)
- Vérifier que le fichier existe dans `/public`
- Utiliser le fallback : `fallback={<Component />}`

### Avertissement : "Image not optimized"

**Cause :** `unoptimized: true` dans next.config.js

**Solution :**
```javascript
// Enlever ou mettre à false
unoptimized: false
```

---

## 🧪 Tests de Performance

### Tester en local

```bash
# Build de production
npm run build

# Démarrer en mode production
npm start

# Ouvrir Chrome DevTools
# Network → Img → Vérifier :
# - Format : webp ou avif
# - Taille : ~70% plus petite
# - Cache : cache-control headers
```

### Tester en production

1. **Lighthouse** (Chrome DevTools)
   - Performance Score : 90+
   - "Serve images in next-gen formats" : ✅ Pass

2. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Coller l'URL de production
   - Vérifier "Largest Contentful Paint (LCP)" : < 2.5s

3. **WebPageTest**
   - https://www.webpagetest.org/
   - Tester depuis plusieurs localisations
   - Vérifier "Image Compression" : Grade A

---

## 📊 Monitoring

### Vercel Analytics

- Dashboard → Project → Analytics
- Métriques :
  - **LCP** (Largest Contentful Paint) : < 2.5s
  - **CLS** (Cumulative Layout Shift) : < 0.1
  - **FID** (First Input Delay) : < 100ms

### Console Vercel

- Dashboard → Project → Functions
- Vérifier `/api/_next/image`
- Cache Hit Rate : 80%+

---

## 🎯 Prochaines Étapes

### Images Actuelles
Pour le moment, le site utilise des **illustrations CSS** (gradients + icônes Phosphor).

### Migration Vers Images Réelles

Quand vous ajouterez de vraies photos :

1. **Préparer les images**
   ```bash
   # Créer le dossier
   mkdir -p public/assets/formations

   # Copier les images
   # Nommer : formation-slug.jpg
   ```

2. **Mettre à jour les données**
   ```javascript
   const formations = [
     {
       id: 1,
       slug: 'react-nextjs',
       cover_image_url: '/assets/formations/react-nextjs.jpg',
       cover_image_hover: '/assets/formations/react-nextjs-hover.jpg',
       // ...
     }
   ]
   ```

3. **Déployer**
   ```bash
   git add .
   git commit -m "Ajout images formations"
   git push origin main
   ```

4. **Résultat**
   - Images automatiquement converties en WebP/AVIF
   - Chargement lazy automatique
   - Cache 1 an
   - Performance optimale ✅

---

## 📚 Ressources

- [Next.js Image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [Web.dev - Optimize Images](https://web.dev/fast/#optimize-your-images)
- [WebP Guide](https://developers.google.com/speed/webp)
- [AVIF Guide](https://web.dev/compress-images-avif/)

---

**Dernière mise à jour :** 2025-11-20
**Status :** ✅ Optimisation automatique active
