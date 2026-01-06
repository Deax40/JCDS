# Instructions SQL - Correction de la base de données

## Problème identifié

L'erreur `column u.prenom does not exist` indique que votre base de données Supabase cherche une colonne `prenom` qui n'existe pas.

Le schéma utilise `first_name` et `last_name`, pas `prenom` et `nom`.

## Solution

### Étape 1: Vérifier votre schéma actuel sur Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Ouvrez le SQL Editor
3. Exécutez cette requête pour voir vos colonnes :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

### Étape 2: Exécuter le fichier de correction

Dans le SQL Editor de Supabase, **copiez et collez tout le contenu** du fichier :

```
database/fix_schema.sql
```

### Étape 3: Si nécessaire, renommer les colonnes

Si vous voyez que votre table a des colonnes `prenom` et `nom`, exécutez :

```sql
ALTER TABLE users RENAME COLUMN prenom TO first_name;
ALTER TABLE users RENAME COLUMN nom TO last_name;
```

### Étape 4: Vérifier que tout fonctionne

Exécutez cette requête de test :

```sql
SELECT id, email, first_name, last_name, pseudo, genre, phone
FROM users
LIMIT 5;
```

## Fichiers SQL dans le projet

- `database/schema.sql` - Schéma complet de la base de données (à exécuter sur une nouvelle base)
- `database/migration_add_pseudo_genre.sql` - Migration pour ajouter pseudo et genre
- `database/fix_schema.sql` - **Correction du problème actuel** ✅

## Après avoir exécuté le SQL

Une fois le SQL exécuté sur Supabase, le déploiement sur Vercel devrait automatiquement fonctionner car le code sera à jour.
