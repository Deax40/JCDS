-- Migration: Ajout des champs pseudo et genre
-- À exécuter sur votre base de données Supabase

-- Ajouter le champ pseudo (unique)
ALTER TABLE users ADD COLUMN IF NOT EXISTS pseudo VARCHAR(100) UNIQUE;

-- Ajouter le champ genre
ALTER TABLE users ADD COLUMN IF NOT EXISTS genre VARCHAR(20) CHECK (genre IN ('homme', 'femme'));

-- Créer un index pour le pseudo (pour les recherches rapides)
CREATE INDEX IF NOT EXISTS idx_users_pseudo ON users(pseudo);

-- Créer un index pour le téléphone (pour vérification d'unicité)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Rendre le téléphone unique
ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- Commentaires
COMMENT ON COLUMN users.pseudo IS 'Pseudo unique de l''utilisateur pour affichage public';
COMMENT ON COLUMN users.genre IS 'Genre de l''utilisateur (homme/femme) pour déterminer l''avatar';
