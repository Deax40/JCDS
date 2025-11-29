-- Migration: Ajout des champs de profil formateur
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-26

DO $$
BEGIN
    -- Ajouter bio si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'bio'
    ) THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Colonne bio ajoutée';
    END IF;

    -- Ajouter compétences
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'competences'
    ) THEN
        ALTER TABLE users ADD COLUMN competences TEXT[];
        RAISE NOTICE 'Colonne competences ajoutée';
    END IF;

    -- Ajouter site web
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'website'
    ) THEN
        ALTER TABLE users ADD COLUMN website VARCHAR(255);
        RAISE NOTICE 'Colonne website ajoutée';
    END IF;

    -- Ajouter Instagram
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'instagram'
    ) THEN
        ALTER TABLE users ADD COLUMN instagram VARCHAR(255);
        RAISE NOTICE 'Colonne instagram ajoutée';
    END IF;

    -- Ajouter Twitter/X
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'twitter'
    ) THEN
        ALTER TABLE users ADD COLUMN twitter VARCHAR(255);
        RAISE NOTICE 'Colonne twitter ajoutée';
    END IF;

    -- Ajouter Facebook
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'facebook'
    ) THEN
        ALTER TABLE users ADD COLUMN facebook VARCHAR(255);
        RAISE NOTICE 'Colonne facebook ajoutée';
    END IF;

    -- Ajouter LinkedIn
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'linkedin'
    ) THEN
        ALTER TABLE users ADD COLUMN linkedin VARCHAR(255);
        RAISE NOTICE 'Colonne linkedin ajoutée';
    END IF;

END $$;

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration terminée!';
    RAISE NOTICE 'Les champs de profil formateur ont été ajoutés à la table users';
    RAISE NOTICE '';
END $$;
