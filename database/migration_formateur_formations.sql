-- Migration: Extension de la table formations pour les formateurs
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-25

-- Vérifier que la table formations existe, sinon la créer
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'formations') THEN
        -- Créer la table formations complète
        CREATE TABLE formations (
            id SERIAL PRIMARY KEY,
            seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            category_slug VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            tags TEXT[] DEFAULT ARRAY[]::TEXT[],

            -- Type de formation
            formation_type VARCHAR(50) NOT NULL CHECK (formation_type IN ('en_ligne', 'pdf', 'visio')),

            -- Pour formations en visio
            visio_link TEXT,
            visio_date TIMESTAMP,
            visio_duration INTEGER, -- en minutes

            -- Limitations
            has_time_limit BOOLEAN DEFAULT FALSE,
            time_limit_date TIMESTAMP,
            has_quantity_limit BOOLEAN DEFAULT FALSE,
            quantity_limit INTEGER,
            quantity_sold INTEGER DEFAULT 0,

            -- Prix
            price_mode VARCHAR(10) DEFAULT 'ttc' CHECK (price_mode IN ('ttc', 'net')),
            price_entered DECIMAL(10, 2) NOT NULL, -- Prix entré par le formateur
            price_ttc DECIMAL(10, 2) NOT NULL, -- Prix TTC (ce que paie le client)
            price_net DECIMAL(10, 2) NOT NULL, -- Prix net (ce que reçoit le formateur)
            sumup_fee DECIMAL(10, 2) NOT NULL, -- Frais SumUp (2.5%)
            platform_fee DECIMAL(10, 2) NOT NULL, -- Frais plateforme (10%)

            -- Image (reprend celle de la catégorie par défaut)
            cover_image_url TEXT,

            -- Statut
            is_active BOOLEAN DEFAULT TRUE,
            is_published BOOLEAN DEFAULT TRUE,

            -- Stats
            total_sales INTEGER DEFAULT 0,
            total_revenue DECIMAL(10, 2) DEFAULT 0.00,
            average_rating DECIMAL(3, 2) DEFAULT 0.00,
            total_reviews INTEGER DEFAULT 0,

            -- Dates
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        RAISE NOTICE 'Table formations créée';
    ELSE
        -- Ajouter les colonnes manquantes si la table existe déjà

        -- Type de formation
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'formation_type') THEN
            ALTER TABLE formations ADD COLUMN formation_type VARCHAR(50) DEFAULT 'en_ligne' CHECK (formation_type IN ('en_ligne', 'pdf', 'visio'));
        END IF;

        -- Visio
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'visio_link') THEN
            ALTER TABLE formations ADD COLUMN visio_link TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'visio_date') THEN
            ALTER TABLE formations ADD COLUMN visio_date TIMESTAMP;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'visio_duration') THEN
            ALTER TABLE formations ADD COLUMN visio_duration INTEGER;
        END IF;

        -- Limitations
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'has_time_limit') THEN
            ALTER TABLE formations ADD COLUMN has_time_limit BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'time_limit_date') THEN
            ALTER TABLE formations ADD COLUMN time_limit_date TIMESTAMP;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'has_quantity_limit') THEN
            ALTER TABLE formations ADD COLUMN has_quantity_limit BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'quantity_limit') THEN
            ALTER TABLE formations ADD COLUMN quantity_limit INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'quantity_sold') THEN
            ALTER TABLE formations ADD COLUMN quantity_sold INTEGER DEFAULT 0;
        END IF;

        -- Prix
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'price_mode') THEN
            ALTER TABLE formations ADD COLUMN price_mode VARCHAR(10) DEFAULT 'ttc' CHECK (price_mode IN ('ttc', 'net'));
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'price_entered') THEN
            ALTER TABLE formations ADD COLUMN price_entered DECIMAL(10, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'price_ttc') THEN
            ALTER TABLE formations ADD COLUMN price_ttc DECIMAL(10, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'price_net') THEN
            ALTER TABLE formations ADD COLUMN price_net DECIMAL(10, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'sumup_fee') THEN
            ALTER TABLE formations ADD COLUMN sumup_fee DECIMAL(10, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'platform_fee') THEN
            ALTER TABLE formations ADD COLUMN platform_fee DECIMAL(10, 2);
        END IF;

        -- Category slug si n'existe pas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'formations' AND column_name = 'category_slug') THEN
            ALTER TABLE formations ADD COLUMN category_slug VARCHAR(100);
        END IF;

        RAISE NOTICE 'Colonnes manquantes ajoutées à formations';
    END IF;
END $$;

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_formations_seller ON formations(seller_id);
CREATE INDEX IF NOT EXISTS idx_formations_category ON formations(category_slug);
CREATE INDEX IF NOT EXISTS idx_formations_published ON formations(is_published, is_active);
CREATE INDEX IF NOT EXISTS idx_formations_created ON formations(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_formations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_formations_timestamp ON formations;
CREATE TRIGGER update_formations_timestamp
BEFORE UPDATE ON formations
FOR EACH ROW EXECUTE FUNCTION update_formations_updated_at();

-- Commentaires
COMMENT ON COLUMN formations.formation_type IS 'Type: en_ligne (vidéo en ligne), pdf (fichier PDF), visio (visioconférence)';
COMMENT ON COLUMN formations.price_mode IS 'Mode prix: ttc (prix client) ou net (prix formateur)';
COMMENT ON COLUMN formations.price_entered IS 'Prix entré par le formateur selon price_mode';
COMMENT ON COLUMN formations.price_ttc IS 'Prix TTC que paie le client';
COMMENT ON COLUMN formations.price_net IS 'Prix net que reçoit le formateur';
COMMENT ON COLUMN formations.sumup_fee IS 'Frais SumUp: 2.5% du prix TTC';
COMMENT ON COLUMN formations.platform_fee IS 'Frais plateforme: 10% du prix TTC';

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Migration formations terminée!';
    RAISE NOTICE 'Table formations prête pour les formateurs';
END $$;
