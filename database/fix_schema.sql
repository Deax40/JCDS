-- ==========================================
-- FIX: Correction du schéma de base de données
-- ==========================================
-- Ce fichier s'assure que les colonnes de la table users sont correctes
-- À exécuter sur votre base de données Supabase

-- 1. Vérifier et ajouter les colonnes manquantes si nécessaire
-- (Les colonnes first_name et last_name devraient déjà exister)

-- Si vous avez des colonnes prenom/nom au lieu de first_name/last_name,
-- décommentez les lignes suivantes :
-- ALTER TABLE users RENAME COLUMN prenom TO first_name;
-- ALTER TABLE users RENAME COLUMN nom TO last_name;

-- 2. S'assurer que pseudo et genre existent (déjà dans migration_add_pseudo_genre.sql)
ALTER TABLE users ADD COLUMN IF NOT EXISTS pseudo VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS genre VARCHAR(20) CHECK (genre IN ('homme', 'femme'));

-- 3. Créer des index si ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_users_pseudo ON users(pseudo);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 4. Ajouter la contrainte unique pour le téléphone si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_phone_unique'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
    END IF;
END $$;

-- 5. Vérification: Afficher la structure de la table users
-- Décommentez la ligne suivante pour voir les colonnes :
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
