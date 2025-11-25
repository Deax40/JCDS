# Migrations de Base de Données

Ce dossier contient les migrations SQL pour maintenir votre base de données à jour.

## 🚀 Comment exécuter les migrations sur Supabase

### Méthode 1: Via l'interface Supabase (Recommandé)

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (dans le menu de gauche)
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier de migration
6. Cliquez sur **Run** ou appuyez sur `Ctrl+Enter`

### Méthode 2: Via la CLI Supabase

```bash
# Installer la CLI Supabase (si pas déjà fait)
npm install -g supabase

# Se connecter
supabase login

# Exécuter une migration
supabase db push --db-url "votre_database_url"
```

### Méthode 3: Via psql (ligne de commande PostgreSQL)

```bash
# Remplacez les valeurs par vos credentials
psql "postgresql://user:password@host:port/database" -f migration_add_roles_column.sql
```

## 📋 Ordre d'exécution des migrations

Exécutez les migrations dans cet ordre:

1. **schema.sql** - Schéma initial (si nouvelle base de données)
2. **migration_add_pseudo_genre.sql** - Ajoute les colonnes pseudo et genre
3. **migration_add_roles_column.sql** - Ajoute la colonne roles (EXÉCUTEZ CELLE-CI MAINTENANT!)

## ⚠️ Migration Urgente Requise

### Error: `column "roles" does not exist`

Si vous rencontrez cette erreur, vous devez exécuter immédiatement:

```sql
-- Fichier: migration_add_roles_column.sql
```

Cette migration va:
- ✅ Ajouter la colonne `roles` comme tableau de texte
- ✅ Définir la valeur par défaut à `['acheteur']`
- ✅ Migrer les données de l'ancienne colonne `role` si elle existe
- ✅ Créer un index pour améliorer les performances
- ✅ Mettre à jour tous les utilisateurs existants

## 🔍 Vérifier que la migration a fonctionné

Après avoir exécuté la migration, vérifiez avec cette requête:

```sql
-- Vérifier que la colonne existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'roles';

-- Vérifier les données
SELECT id, email, roles FROM users LIMIT 5;
```

Vous devriez voir:
- `column_name: roles`
- `data_type: ARRAY`
- Des valeurs comme `{acheteur}` ou `{formateur}` dans la colonne roles

## 📝 Notes Importantes

- Les migrations sont **idempotentes** (peuvent être exécutées plusieurs fois sans erreur)
- Toujours faire un **backup** avant d'exécuter une migration en production
- Les migrations incluent des vérifications pour éviter les doublons

## 🆘 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans Supabase Dashboard > Database > Logs
2. Vérifiez que votre `DATABASE_URL` est correcte dans `.env`
3. Assurez-vous d'avoir les permissions nécessaires sur la base de données
