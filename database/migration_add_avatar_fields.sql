-- Migration: Ajout des champs avatar personnalisés
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-26

DO $$
BEGIN
    -- Ajouter avatar_color si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'avatar_color'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_color VARCHAR(50) DEFAULT 'purple';
        RAISE NOTICE 'Colonne avatar_color ajoutée';
    END IF;

    -- Ajouter avatar_shape si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'avatar_shape'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_shape VARCHAR(20) DEFAULT 'circle';
        RAISE NOTICE 'Colonne avatar_shape ajoutée';
    END IF;

END $$;

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration terminée!';
    RAISE NOTICE 'Les champs avatar personnalisés ont été ajoutés à la table users';
    RAISE NOTICE '';
END $$;
