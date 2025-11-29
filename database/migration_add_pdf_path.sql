-- Migration: Ajout de la colonne pdf_path pour Supabase Storage
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-25

DO $$
BEGIN
    -- Ajouter la colonne pdf_path si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'pdf_path'
    ) THEN
        ALTER TABLE formations ADD COLUMN pdf_path TEXT;
        RAISE NOTICE 'Colonne pdf_path ajoutée à la table formations';
    ELSE
        RAISE NOTICE 'La colonne pdf_path existe déjà';
    END IF;
END $$;

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Migration terminée!';
    RAISE NOTICE 'La colonne pdf_path a été ajoutée pour stocker les chemins des PDF dans Supabase Storage';
    RAISE NOTICE 'Format: formations/{formateurId}/{formationId}.pdf';
END $$;
