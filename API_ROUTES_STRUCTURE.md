# 🔌 STRUCTURE DES API ROUTES - FORMATIONPLACE

Ce document décrit la structure complète des API Routes à développer pour le backend de FormationPlace.

---

## 📁 Structure des Fichiers

```
pages/api/
├── auth/
│   ├── register.js           # POST - Inscription
│   ├── login.js              # POST - Connexion
│   ├── logout.js             # POST - Déconnexion
│   └── [...nextauth].js      # NextAuth configuration
├── formations/
│   ├── index.js              # GET - Liste formations / POST - Créer formation
│   ├── [id].js               # GET - Détail / PUT - Modifier / DELETE - Supprimer
│   ├── search.js             # GET - Rechercher formations
│   └── by-seller/[sellerId].js # GET - Formations d'un vendeur
├── categories/
│   ├── index.js              # GET - Liste catégories
│   └── [slug].js             # GET - Formations d'une catégorie
├── sellers/
│   ├── profile/[id].js       # GET - Profil vendeur
│   └── stats.js              # GET - Stats du vendeur connecté
├── cart/
│   ├── index.js              # GET - Récupérer panier
│   ├── add.js                # POST - Ajouter au panier
│   └── remove.js             # DELETE - Supprimer du panier
├── checkout/
│   ├── create-session.js     # POST - Créer session SumUp
│   ├── confirm.js            # POST - Confirmer paiement
│   └── webhook.js            # POST - Webhook SumUp
├── reviews/
│   ├── create.js             # POST - Créer un avis
│   ├── [formationId].js      # GET - Avis d'une formation
│   └── by-seller/[sellerId].js # GET - Avis d'un vendeur
└── orders/
    ├── index.js              # GET - Mes commandes
    └── [id].js               # GET - Détail commande
```

---

## 🔐 AUTHENTIFICATION

### `POST /api/auth/register`

**Description :** Créer un nouveau compte (acheteur ou vendeur)

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "buyer" | "seller"
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "userId": 123
}
```

**Logique :**
1. Valider les données (email valide, mot de passe fort)
2. Vérifier que l'email n'existe pas déjà
3. Hasher le mot de passe avec bcrypt
4. Insérer dans la table `users`
5. Si role = "seller", créer également un profil dans `seller_profiles`
6. Envoyer un email de confirmation (optionnel)

---

### `POST /api/auth/login`

**Description :** Se connecter

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "buyer"
  }
}
```

**Logique :**
1. Vérifier que l'email existe
2. Vérifier le mot de passe avec bcrypt.compare()
3. Générer un JWT token
4. Retourner le token et les infos user

---

### `POST /api/auth/logout`

**Description :** Se déconnecter

**Logique :**
- Invalider le token (ajouter à une blacklist si nécessaire)
- Supprimer le cookie de session

---

### `pages/api/auth/[...nextauth].js`

**Configuration NextAuth :**
```javascript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const result = await query(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email]
        );

        if (result.rows.length === 0) return null;

        const user = result.rows[0];
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
});
```

---

## 📚 FORMATIONS

### `GET /api/formations`

**Description :** Liste de toutes les formations avec filtres

**Query params :**
- `?category=slug` - Filtrer par catégorie
- `?search=keyword` - Recherche par titre
- `?filter=populaires|mieux-notees|nouvelles|promo` - Filtres prédéfinis
- `?page=1&limit=12` - Pagination
- `?seller=123` - Formations d'un vendeur spécifique

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "formation-react-nextjs",
      "title": "Maîtrisez React et Next.js",
      "description_short": "...",
      "cover_image_url": "...",
      "price": 89.00,
      "promo_price": 59.00,
      "is_promo_active": true,
      "average_rating": 4.5,
      "total_reviews": 127,
      "seller": {
        "id": 5,
        "display_name": "Jean Dupont",
        "avatar_url": "..."
      },
      "category": {
        "id": 1,
        "name": "Développement Web",
        "slug": "developpement-web"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 245,
    "totalPages": 21
  }
}
```

**Logique SQL :**
```sql
SELECT
  f.*,
  c.name as category_name,
  c.slug as category_slug,
  sp.display_name as seller_name,
  u.avatar_url as seller_avatar
FROM formations f
LEFT JOIN categories c ON f.category_id = c.id
LEFT JOIN users u ON f.seller_id = u.id
LEFT JOIN seller_profiles sp ON u.id = sp.user_id
WHERE f.is_active = TRUE AND f.is_published = TRUE
  -- Ajouter les filtres selon les query params
ORDER BY
  CASE WHEN filter = 'populaires' THEN f.total_sales END DESC,
  CASE WHEN filter = 'mieux-notees' THEN f.average_rating END DESC,
  CASE WHEN filter = 'nouvelles' THEN f.created_at END DESC
LIMIT 12 OFFSET 0;
```

---

### `POST /api/formations`

**Description :** Créer une nouvelle formation (vendeur uniquement)

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "title": "Ma nouvelle formation",
  "slug": "ma-nouvelle-formation",
  "description_short": "Description courte",
  "description_long": "<p>Description HTML complète</p>",
  "category_id": 1,
  "price": 89.00,
  "promo_price": 59.00,
  "is_promo_active": true,
  "cover_image_url": "https://...",
  "tags": ["React", "JavaScript"],
  "is_published": true
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "message": "Formation créée avec succès",
  "formationId": 123
}
```

**Logique :**
1. Vérifier que l'utilisateur est authentifié et a le role "seller"
2. Valider les données
3. Vérifier que le slug est unique
4. Insérer dans `formations` avec `seller_id = userId`

---

### `GET /api/formations/[id]`

**Description :** Détails d'une formation

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "formation-react-nextjs",
    "title": "...",
    "description_long": "...",
    "price": 89.00,
    "average_rating": 4.5,
    "total_reviews": 127,
    "total_sales": 342,
    "seller": {
      "id": 5,
      "display_name": "Jean Dupont",
      "avatar_url": "...",
      "average_rating": 4.7
    },
    "category": { ... },
    "tags": ["React", "Next.js"]
  }
}
```

---

### `PUT /api/formations/[id]`

**Description :** Modifier une formation (vendeur propriétaire uniquement)

**Logique :**
1. Vérifier que l'utilisateur est le propriétaire (seller_id = userId)
2. Mettre à jour les champs autorisés

---

### `DELETE /api/formations/[id]`

**Description :** Supprimer une formation (ou simplement désactiver)

**Logique :**
1. Vérifier ownership
2. Mettre `is_active = FALSE` au lieu de supprimer (soft delete)

---

## 🛒 PANIER

### `GET /api/cart`

**Description :** Récupérer le panier de l'utilisateur connecté

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "formation_id": 1,
      "title": "Formation React",
      "cover_image_url": "...",
      "price": 89.00,
      "promo_price": 59.00,
      "seller_name": "Jean Dupont",
      "added_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 118.00
}
```

**Logique SQL :**
```sql
SELECT
  c.formation_id,
  f.title,
  f.cover_image_url,
  f.price,
  f.promo_price,
  f.is_promo_active,
  sp.display_name as seller_name,
  c.added_at
FROM cart c
LEFT JOIN formations f ON c.formation_id = f.id
LEFT JOIN users u ON f.seller_id = u.id
LEFT JOIN seller_profiles sp ON u.id = sp.user_id
WHERE c.user_id = $1;
```

---

### `POST /api/cart/add`

**Description :** Ajouter une formation au panier

**Body :**
```json
{
  "formationId": 1
}
```

**Logique :**
1. Vérifier que l'utilisateur ne possède pas déjà cette formation
2. Vérifier que la formation existe et est active
3. Insérer dans `cart` (ou ignorer si déjà présent)

---

### `DELETE /api/cart/remove`

**Description :** Supprimer une formation du panier

**Body :**
```json
{
  "formationId": 1
}
```

**Logique :**
```sql
DELETE FROM cart WHERE user_id = $1 AND formation_id = $2;
```

---

## 💳 CHECKOUT ET PAIEMENT

### `POST /api/checkout/create-session`

**Description :** Créer une session de paiement SumUp

**Body :**
```json
{
  "formationIds": [1, 2, 3]
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "checkoutId": "sumup-checkout-id-123",
  "checkoutUrl": "https://pay.sumup.com/checkout/..."
}
```

**Logique :**
1. Récupérer les formations depuis le panier
2. Calculer le total
3. Créer une commande en base avec status "pending"
4. Appeler l'API SumUp pour créer un checkout
5. Retourner l'URL de paiement

**Appel API SumUp :**
```javascript
const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SUMUP_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    checkout_reference: `order-${orderId}`,
    amount: totalAmount,
    currency: 'EUR',
    merchant_code: process.env.SUMUP_MERCHANT_CODE,
    description: `Achat de ${formationIds.length} formations`,
    redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`
  })
});
```

---

### `POST /api/checkout/confirm`

**Description :** Confirmer le paiement après retour de SumUp

**Body :**
```json
{
  "orderId": 123,
  "sumupTransactionId": "txn-sumup-xyz"
}
```

**Logique :**
1. Vérifier le statut du paiement auprès de SumUp
2. Si validé :
   - Mettre à jour `orders.payment_status = 'completed'`
   - Créer les `order_items` pour chaque formation
   - Calculer les montants vendeurs (90%) et commission (10%)
   - Vider le panier
   - Envoyer email de confirmation
3. Retourner success

---

### `POST /api/checkout/webhook`

**Description :** Webhook SumUp pour recevoir les notifications de paiement

**Logique :**
1. Vérifier la signature du webhook
2. Mettre à jour le statut de la commande selon le statut reçu

---

## ⭐ AVIS

### `POST /api/reviews/create`

**Description :** Laisser un avis sur une formation achetée

**Body :**
```json
{
  "formationId": 1,
  "orderId": 123,
  "rating": 5,
  "comment": "Excellente formation !"
}
```

**Logique :**
1. Vérifier que l'utilisateur a bien acheté cette formation (vérifier dans order_items)
2. Vérifier qu'il n'a pas déjà laissé d'avis pour cette commande
3. Insérer dans `reviews` avec `seller_id` récupéré depuis `formations`
4. Les triggers SQL mettront à jour automatiquement :
   - `formations.average_rating`
   - `formations.total_reviews`
   - `seller_profiles.average_rating`
   - `seller_profiles.total_reviews`

---

### `GET /api/reviews/[formationId]`

**Description :** Récupérer tous les avis d'une formation

**Query params :**
- `?page=1&limit=10` - Pagination
- `?sort=recent|rating` - Tri

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "buyer_name": "Marie L.",
      "rating": 5,
      "comment": "Excellente formation !",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

## 📦 COMMANDES

### `GET /api/orders`

**Description :** Récupérer les commandes de l'utilisateur connecté

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "order_number": "ORD-20250115-123",
      "total_amount": 118.00,
      "payment_status": "completed",
      "created_at": "2025-01-15T10:30:00Z",
      "items": [
        {
          "formation_id": 1,
          "title": "Formation React",
          "price_paid": 59.00
        }
      ]
    }
  ]
}
```

---

### `GET /api/orders/[id]`

**Description :** Détails d'une commande spécifique

---

## 🔧 UTILITAIRES

### Middleware d'authentification

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = (handler) => async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Non authentifié' });
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    req.user = decoded; // { id, email, role }
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};
```

**Usage :**
```javascript
// pages/api/formations/index.js
import { authenticate } from '../../../middleware/auth';

async function handler(req, res) {
  // req.user est disponible
  const userId = req.user.id;
  // ...
}

export default authenticate(handler);
```

---

### Connexion à la base de données

```javascript
// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);
```

**Usage :**
```javascript
import { query } from '../../../lib/db';

const result = await query('SELECT * FROM formations WHERE id = $1', [formationId]);
const formation = result.rows[0];
```

---

## 📊 EXEMPLE COMPLET : Créer une formation

```javascript
// pages/api/formations/index.js
import { query } from '../../../lib/db';
import { authenticate } from '../../../middleware/auth';

async function handler(req, res) {
  if (req.method === 'POST') {
    // Vérifier que l'utilisateur est vendeur
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les vendeurs peuvent créer des formations'
      });
    }

    const {
      title,
      slug,
      description_short,
      description_long,
      category_id,
      price,
      promo_price,
      is_promo_active,
      cover_image_url,
      tags,
      is_published
    } = req.body;

    // Validation
    if (!title || !slug || !price) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants'
      });
    }

    // Vérifier que le slug est unique
    const slugCheck = await query('SELECT id FROM formations WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ce slug existe déjà'
      });
    }

    // Insérer la formation
    const result = await query(
      `INSERT INTO formations (
        seller_id, category_id, title, slug,
        description_short, description_long,
        price, promo_price, is_promo_active,
        cover_image_url, tags, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        req.user.id, category_id, title, slug,
        description_short, description_long,
        price, promo_price, is_promo_active,
        cover_image_url, tags, is_published
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Formation créée avec succès',
      formationId: result.rows[0].id
    });
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
}

export default authenticate(handler);
```

---

**🎉 Vous avez maintenant toute la structure des API Routes à développer !**

Référez-vous à ce document pour implémenter chaque endpoint de manière cohérente et sécurisée. 🚀
