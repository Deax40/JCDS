-- ========================================
-- MIGRATION COMPLÈTE DE CORRECTION DU SCHÉMA
-- Exécuter sur Supabase SQL Editor
-- ========================================

-- ÉTAPE 1: Supprimer la contrainte NOT NULL sur slug (temporairement)
-- ========================================

DO $$
BEGIN
    -- Retirer NOT NULL de slug si elle existe
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE formations ALTER COLUMN slug DROP NOT NULL;
        RAISE NOTICE 'Contrainte NOT NULL retirée de slug';
    END IF;
END $$;

-- ÉTAPE 2: Renommer slug en category_slug
-- ========================================

DO $$
BEGIN
    -- Si slug existe et category_slug n'existe pas
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

    -- Si category_slug n'existe toujours pas, la créer
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'category_slug'
    ) THEN
        ALTER TABLE formations ADD COLUMN category_slug VARCHAR(100);
        RAISE NOTICE 'Colonne category_slug créée';
    END IF;
END $$;

-- ÉTAPE 3: Ajouter toutes les colonnes manquantes
-- ========================================

DO $$
BEGIN
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

    -- Ajouter pdf_path si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'pdf_path'
    ) THEN
        ALTER TABLE formations ADD COLUMN pdf_path TEXT;
        RAISE NOTICE 'Colonne pdf_path ajoutée';
    END IF;

    -- Ajouter total_revenue si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'total_revenue'
    ) THEN
        ALTER TABLE formations ADD COLUMN total_revenue DECIMAL(10, 2) DEFAULT 0.00;
        RAISE NOTICE 'Colonne total_revenue ajoutée';
    END IF;

    -- Ajouter price_ttc si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price_ttc'
    ) THEN
        ALTER TABLE formations ADD COLUMN price_ttc DECIMAL(10, 2);
        RAISE NOTICE 'Colonne price_ttc ajoutée';
    END IF;

    -- Ajouter price_net si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price_net'
    ) THEN
        ALTER TABLE formations ADD COLUMN price_net DECIMAL(10, 2);
        RAISE NOTICE 'Colonne price_net ajoutée';
    END IF;

    -- Ajouter visio_link si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'visio_link'
    ) THEN
        ALTER TABLE formations ADD COLUMN visio_link TEXT;
        RAISE NOTICE 'Colonne visio_link ajoutée';
    END IF;
END $$;

-- ÉTAPE 4: Migrer les données des anciennes colonnes vers les nouvelles
-- ========================================

DO $$
BEGIN
    -- Copier description_long vers description si nécessaire
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'description_long'
    ) THEN
        UPDATE formations SET description = description_long WHERE description IS NULL;
        ALTER TABLE formations DROP COLUMN description_long;
        RAISE NOTICE 'Données migrées de description_long vers description';
    END IF;

    -- Copier price vers price_ttc si nécessaire
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price'
    ) AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price_ttc'
    ) THEN
        UPDATE formations SET price_ttc = price WHERE price_ttc IS NULL AND price IS NOT NULL;
        ALTER TABLE formations DROP COLUMN price;
        RAISE NOTICE 'Données migrées de price vers price_ttc';
    END IF;

    -- Copier promo_price vers price_net si nécessaire
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'promo_price'
    ) AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'price_net'
    ) THEN
        UPDATE formations SET price_net = promo_price WHERE price_net IS NULL AND promo_price IS NOT NULL;
        ALTER TABLE formations DROP COLUMN promo_price;
        RAISE NOTICE 'Données migrées de promo_price vers price_net';
    END IF;
END $$;

-- ÉTAPE 5: Supprimer les anciennes colonnes inutiles
-- ========================================

DO $$
BEGIN
    -- Supprimer description_short si elle existe
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'description_short'
    ) THEN
        ALTER TABLE formations DROP COLUMN description_short;
        RAISE NOTICE 'Colonne description_short supprimée';
    END IF;

    -- Supprimer category_id si elle existe
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE formations DROP CONSTRAINT IF EXISTS formations_category_id_fkey;
        ALTER TABLE formations DROP COLUMN category_id;
        RAISE NOTICE 'Colonne category_id supprimée';
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

    -- Supprimer slug si elle existe encore (après renommage)
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'formations'
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE formations DROP COLUMN slug;
        RAISE NOTICE 'Colonne slug supprimée';
    END IF;
END $$;

-- ÉTAPE 6: Créer la table purchases si elle n'existe pas
-- ========================================

CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    price_paid DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'sumup',
    payment_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, formation_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_formation_id ON purchases(formation_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchased_at ON purchases(purchased_at DESC);

-- Trigger
CREATE OR REPLACE FUNCTION increment_formation_sales()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE formations
    SET
        quantity_sold = quantity_sold + 1,
        total_sales = total_sales + 1,
        total_revenue = total_revenue + (SELECT price_net FROM formations WHERE id = NEW.formation_id)
    WHERE id = NEW.formation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
    RAISE NOTICE '✅ SCHÉMA COMPLÈTEMENT CORRIGÉ!';
    RAISE NOTICE '====================================';
    RAISE NOTICE '';
    RAISE NOTICE '✓ Colonnes renommées correctement';
    RAISE NOTICE '✓ Colonnes manquantes ajoutées';
    RAISE NOTICE '✓ Anciennes colonnes supprimées';
    RAISE NOTICE '✓ Table purchases créée';
    RAISE NOTICE '';
    RAISE NOTICE 'Votre base de données est prête!';
    RAISE NOTICE '';
END $$;
