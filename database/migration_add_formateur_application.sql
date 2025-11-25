-- Migration: Ajout du système de candidature formateur
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-25

-- Ajouter les colonnes pour gérer les candidatures formateur
DO $$
BEGIN
    -- Colonne pour le statut de la candidature formateur
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'formateur_application_status'
    ) THEN
        ALTER TABLE users ADD COLUMN formateur_application_status VARCHAR(50) DEFAULT NULL;
        RAISE NOTICE 'Colonne formateur_application_status ajoutée';
    ELSE
        RAISE NOTICE 'La colonne formateur_application_status existe déjà';
    END IF;

    -- Colonne pour la raison de candidature
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'formateur_application_reason'
    ) THEN
        ALTER TABLE users ADD COLUMN formateur_application_reason TEXT DEFAULT NULL;
        RAISE NOTICE 'Colonne formateur_application_reason ajoutée';
    ELSE
        RAISE NOTICE 'La colonne formateur_application_reason existe déjà';
    END IF;

    -- Colonne pour le type de formations
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'formateur_application_formation_type'
    ) THEN
        ALTER TABLE users ADD COLUMN formateur_application_formation_type TEXT DEFAULT NULL;
        RAISE NOTICE 'Colonne formateur_application_formation_type ajoutée';
    ELSE
        RAISE NOTICE 'La colonne formateur_application_formation_type existe déjà';
    END IF;

    -- Colonne pour la date de candidature
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'formateur_application_date'
    ) THEN
        ALTER TABLE users ADD COLUMN formateur_application_date TIMESTAMP DEFAULT NULL;
        RAISE NOTICE 'Colonne formateur_application_date ajoutée';
    ELSE
        RAISE NOTICE 'La colonne formateur_application_date existe déjà';
    END IF;
END $$;

-- Créer un index pour rechercher rapidement les candidatures en attente
CREATE INDEX IF NOT EXISTS idx_users_formateur_application_status
ON users(formateur_application_status)
WHERE formateur_application_status IS NOT NULL;

-- Ajouter une contrainte CHECK pour les statuts valides
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_formateur_application_status'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT check_formateur_application_status
        CHECK (formateur_application_status IN (NULL, 'pending', 'approved', 'rejected'));
        RAISE NOTICE 'Contrainte check_formateur_application_status ajoutée';
    ELSE
        RAISE NOTICE 'La contrainte check_formateur_application_status existe déjà';
    END IF;
END $$;

-- Commentaires pour documentation
COMMENT ON COLUMN users.formateur_application_status IS
'Statut de la candidature formateur: NULL (pas de demande), pending (en attente), approved (approuvée - devient formateur), rejected (rejetée)';

COMMENT ON COLUMN users.formateur_application_reason IS
'Raison pour laquelle l''utilisateur souhaite devenir formateur';

COMMENT ON COLUMN users.formateur_application_formation_type IS
'Type de formations que l''utilisateur souhaite vendre';

COMMENT ON COLUMN users.formateur_application_date IS
'Date à laquelle la candidature a été soumise';

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Migration terminée avec succès!';
    RAISE NOTICE 'Les colonnes de candidature formateur ont été ajoutées/vérifiées';
    RAISE NOTICE 'Statuts possibles: NULL, pending, approved, rejected';
END $$;
