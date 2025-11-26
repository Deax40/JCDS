-- ========================================
-- SCRIPT DE MIGRATION COMPLET
-- À exécuter sur Supabase SQL Editor
-- ========================================

-- ÉTAPE 1: Correction des colonnes de la table formations
-- ========================================

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

    RAISE NOTICE '✅ ÉTAPE 1 terminée: Colonnes de formations corrigées';
END $$;

-- ÉTAPE 2: Ajout de la colonne pdf_path
-- ========================================

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

    RAISE NOTICE '✅ ÉTAPE 2 terminée: Colonne pdf_path ajoutée';
END $$;

-- ÉTAPE 3: Création de la table purchases
-- ========================================

-- Créer la table purchases (achats) si elle n'existe pas
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,

    -- Prix payé (au moment de l'achat)
    price_paid DECIMAL(10, 2) NOT NULL,

    -- Informations de paiement
    payment_method VARCHAR(50) DEFAULT 'sumup',
    payment_id VARCHAR(255), -- ID de transaction SumUp ou autre
    payment_status VARCHAR(50) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),

    -- Dates
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Unicité: un utilisateur ne peut acheter qu'une fois une formation
    UNIQUE(buyer_id, formation_id)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_formation_id ON purchases(formation_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchased_at ON purchases(purchased_at DESC);

-- Trigger pour incrémenter automatiquement les ventes d'une formation
CREATE OR REPLACE FUNCTION increment_formation_sales()
RETURNS TRIGGER AS $$
BEGIN
    -- Incrémenter quantity_sold et total_sales
    UPDATE formations
    SET
        quantity_sold = quantity_sold + 1,
        total_sales = total_sales + 1,
        total_revenue = total_revenue + (SELECT price_net FROM formations WHERE id = NEW.formation_id)
    WHERE id = NEW.formation_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger si il n'existe pas
DROP TRIGGER IF EXISTS trigger_increment_formation_sales ON purchases;
CREATE TRIGGER trigger_increment_formation_sales
AFTER INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION increment_formation_sales();

-- MESSAGE FINAL
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '====================================';
    RAISE NOTICE '✅ TOUTES LES MIGRATIONS SONT TERMINÉES!';
    RAISE NOTICE '====================================';
    RAISE NOTICE '';
    RAISE NOTICE '✓ Colonnes de formations corrigées';
    RAISE NOTICE '✓ Colonne pdf_path ajoutée';
    RAISE NOTICE '✓ Table purchases créée';
    RAISE NOTICE '✓ Triggers configurés';
    RAISE NOTICE '';
    RAISE NOTICE 'Votre base de données est prête!';
    RAISE NOTICE '';
END $$;
