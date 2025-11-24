# FormationPlace - Marketplace de Formations en Ligne

Marketplace de formations en ligne moderne avec design **Anvogue**, permettant aux formateurs de vendre leurs formations et aux apprenants d'acheter des formations de qualité.

## 🎨 Design

Ce projet utilise le template **Anvogue** - un design moderne e-commerce adapté pour une marketplace de formations, avec Tailwind CSS.

## ✨ Fonctionnalités

### Pour les Acheteurs
- 🔍 Parcourir les formations par catégories
- 🔎 Rechercher des formations
- 📖 Consulter les détails des formations et les avis
- 🛒 Ajouter des formations au panier
- 💳 Acheter des formations via SumUp
- ⭐ Laisser des avis après achat

### Pour les Formateurs/Vendeurs
- 👤 Créer un profil formateur complet
- ➕ Ajouter et gérer des formations
- 💰 Fixer les prix et promotions
- 📊 Suivre les ventes et revenus (90% du prix après commission)
- 💸 Recevoir les paiements

### Système
- 🔐 Paiements sécurisés via SumUp
- 💵 Commission plateforme de 10% (paramétrable)
- ⭐ Système d'avis et de notes
- 🛒 Gestion du panier
- 📱 Design responsive (mobile, tablette, desktop)

## 🚀 Installation Locale

### Prérequis
- Node.js 18+ installé
- PostgreSQL (local ou hébergé)

### Étapes

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

Puis éditer `.env` avec vos vraies valeurs.

4. **Créer la base de données**
Exécuter le script SQL :
```bash
psql $DATABASE_URL < database/schema.sql
```

5. **Lancer en développement**
```bash
npm run dev
```

Le site sera accessible sur http://localhost:3000

## 🌐 Déploiement sur Vercel

### 1. Créer la base de données en ligne
- Vercel Postgres (recommandé)
- Ou Supabase / Neon

### 2. Pousser sur GitHub
```bash
git push -u origin main
```

### 3. Déployer sur Vercel
1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez les variables d'environnement
4. Cliquez sur "Deploy"

Voir `GUIDE_DEMARRAGE_RAPIDE.md` pour les instructions détaillées.

## 📁 Structure du Projet

```
formationplace/
├── components/              # Composants React réutilisables
│   ├── HeaderAnvogue.js    # Header moderne Anvogue
│   ├── FooterAnvogue.js    # Footer Anvogue
│   └── FormationCardAnvogue.js # Carte de formation
├── pages/                   # Pages Next.js
│   ├── index.js            # Page d'accueil
│   ├── formations/         # Pages formations
│   ├── formateurs/         # Pages formateurs
│   └── _document.js        # Document HTML personnalisé
├── styles/                  # Styles CSS
│   └── globals.css         # Styles globaux Tailwind
├── public/                  # Fichiers statiques
├── database/                # Schéma de base de données
│   └── schema.sql          # Script SQL complet
├── tailwind.config.js       # Configuration Tailwind
├── next.config.js           # Configuration Next.js
└── package.json             # Dépendances
```

## 🗄️ Base de Données

### Tables principales
- `users` - Tous les utilisateurs (acheteurs et vendeurs)
- `seller_profiles` - Profils des formateurs
- `formations` - Les formations
- `categories` - Catégories de formations
- `orders` - Commandes
- `order_items` - Détails des commandes
- `reviews` - Avis et notes
- `cart` - Panier d'achat
- `seller_payouts` - Paiements aux vendeurs
- `subscriptions` - Abonnements (futur)

Voir `database/schema.sql` pour le schéma complet.

## 🔑 Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | ✅ |
| `NEXTAUTH_URL` | URL du site | ✅ |
| `NEXTAUTH_SECRET` | Secret pour NextAuth | ✅ |
| `SUMUP_API_KEY` | Clé API SumUp | ✅ |
| `SUMUP_MERCHANT_CODE` | Code marchand SumUp | ✅ |
| `PLATFORM_COMMISSION` | Commission en % (défaut: 10) | ❌ |

## 🛠️ Technologies

- **Frontend** : Next.js 14, React 18, Tailwind CSS
- **Backend** : Next.js API Routes
- **Database** : PostgreSQL
- **Auth** : NextAuth.js
- **Payments** : SumUp
- **Deployment** : Vercel
- **UI Components** : Swiper, Phosphor Icons

## 📞 Support

Pour toute question :
- Email : support@formationplace.com
- GitHub Issues : [github.com/votre-username/formationplace/issues](https://github.com/votre-username/formationplace/issues)

## 📄 Licence

Propriétaire - Tous droits réservés

---

**FormationPlace** - Développez vos compétences, partagez votre expertise 🚀
