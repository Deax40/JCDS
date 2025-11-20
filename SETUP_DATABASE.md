# Configuration de la Base de Données Supabase

## 🔧 Étape 1 : Obtenir la chaîne de connexion PostgreSQL

1. Va sur ton **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionne ton projet `pizavxricwbbrbcovqzi`
3. Va dans **Settings** (⚙️) → **Database**
4. Trouve la section **Connection String**
5. Sélectionne le mode **URI** (PostgreSQL)
6. Copie la chaîne de connexion qui ressemble à :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.pizavxricwbbrbcovqzi.supabase.co:5432/postgres
   ```

## 🔑 Étape 2 : Remplacer [YOUR-PASSWORD]

La chaîne de connexion contient `[YOUR-PASSWORD]` - tu dois le remplacer par ton **vrai mot de passe** de base de données.

**Où trouver ce mot de passe ?**
- Si tu l'as noté lors de la création du projet, utilise-le
- Sinon, tu peux le réinitialiser dans **Settings** → **Database** → **Reset database password**

## 📝 Étape 3 : Mettre à jour le fichier .env

Ouvre le fichier `.env` et remplace cette ligne :

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.pizavxricwbbrbcovqzi.supabase.co:5432/postgres
```

Par ta vraie chaîne de connexion (avec le mot de passe) :

```env
DATABASE_URL=postgresql://postgres:ton-vrai-mot-de-passe@db.pizavxricwbbrbcovqzi.supabase.co:5432/postgres
```

## 🗄️ Étape 4 : Créer les tables dans Supabase

1. Va dans **SQL Editor** sur Supabase
2. Copie le contenu du fichier `database/schema.sql`
3. Colle-le dans l'éditeur SQL
4. Clique sur **Run** pour créer toutes les tables

## ✅ Étape 5 : Redémarrer le serveur

```bash
# Arrête le serveur (Ctrl+C)
# Puis relance :
npm run dev
```

## 🧪 Tester la connexion

Essaie de créer un compte sur http://localhost:3000/register

Si ça fonctionne ✅, tu verras un message de succès !

Si ça échoue ❌, vérifie :
- Le mot de passe dans DATABASE_URL est correct
- Les tables sont bien créées dans Supabase
- Le serveur a redémarré après modification du .env

## 💡 Astuce : Vérifier les erreurs

Si tu as encore une erreur 500, regarde dans le **terminal où tourne npm run dev** pour voir le message d'erreur détaillé.
