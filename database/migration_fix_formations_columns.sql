-- Migration: Correction des colonnes de la table formations
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-25

DO $$
BEGIN
    -- Renommer description_long en description si elle existe
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'description_long'
    ) THEN
        -- Si description n'existe pas déjà, renommer
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'formations'
            AND column_name = 'description'
        ) THEN
            ALTER TABLE formations RENAME COLUMN description_long TO description;
            RAISE NOTICE 'Colonne description_long renommée en description';
        ELSE
            -- Si description existe déjà, copier les données de description_long
            UPDATE formations SET description = description_long WHERE description IS NULL;
            ALTER TABLE formations DROP COLUMN description_long;
            RAISE NOTICE 'Données copiées de description_long vers description';
        END IF;
    END IF;

    -- Ajouter description si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'description'
    ) THEN
        ALTER TABLE formations ADD COLUMN description TEXT;
        RAISE NOTICE 'Colonne description ajoutée';
    END IF;

    -- Supprimer description_short si elle existe (on n'en a pas besoin)
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'description_short'
    ) THEN
        ALTER TABLE formations DROP COLUMN description_short;
        RAISE NOTICE 'Colonne description_short supprimée';
    END IF;

    -- Renommer slug en category_slug si nécessaire
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'slug'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'category_slug'
    ) THEN
        ALTER TABLE formations RENAME COLUMN slug TO category_slug;
        RAISE NOTICE 'Colonne slug renommée en category_slug';
    END IF;

    -- Supprimer la colonne category_id si elle existe (on utilise category_slug)
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'category_id'
    ) THEN
        -- Retirer d'abord la contrainte de clé étrangère si elle existe
        ALTER TABLE formations DROP CONSTRAINT IF EXISTS formations_category_id_fkey;
        -- Supprimer la colonne
        ALTER TABLE formations DROP COLUMN category_id;
        RAISE NOTICE 'Colonne category_id supprimée (on utilise category_slug)';
    END IF;

    -- Renommer price en price_ttc si nécessaire
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price_ttc'
    ) THEN
        ALTER TABLE formations RENAME COLUMN price TO price_ttc;
        RAISE NOTICE 'Colonne price renommée en price_ttc';
    END IF;

    -- Renommer promo_price en price_net si nécessaire ET si price_net n'existe pas
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'promo_price'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price_net'
    ) THEN
        ALTER TABLE formations RENAME COLUMN promo_price TO price_net;
        RAISE NOTICE 'Colonne promo_price renommée en price_net';
    END IF;

    -- Supprimer is_promo_active si elle existe
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'is_promo_active'
    ) THEN
        ALTER TABLE formations DROP COLUMN is_promo_active;
        RAISE NOTICE 'Colonne is_promo_active supprimée';
    END IF;

END $$;

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Migration de correction terminée!';
    RAISE NOTICE 'Les colonnes de la table formations ont été corrigées';
END $$;
