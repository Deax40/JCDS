-- Migration: Ajout des fonctionnalités avancées pour formateurs
-- Vidéo de présentation, certifications, codes promo, bundles
-- Date: 2025-11-26

-- 1. Ajouter les champs au profil formateur (users table)
DO $$
BEGIN
    -- Vidéo YouTube de présentation
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'presentation_video_url'
    ) THEN
        ALTER TABLE users ADD COLUMN presentation_video_url VARCHAR(500);
        RAISE NOTICE 'Colonne presentation_video_url ajoutée';
    END IF;

    -- Activer/désactiver la vidéo
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'show_presentation_video'
    ) THEN
        ALTER TABLE users ADD COLUMN show_presentation_video BOOLEAN DEFAULT false;
        RAISE NOTICE 'Colonne show_presentation_video ajoutée';
    END IF;

    -- Certifications et diplômes (JSON array)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'certifications'
    ) THEN
        ALTER TABLE users ADD COLUMN certifications JSONB DEFAULT '[]';
        RAISE NOTICE 'Colonne certifications ajoutée';
    END IF;
END $$;

-- 2. Table des codes promo
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    formateur_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    applies_to VARCHAR(20) DEFAULT 'all' CHECK (applies_to IN ('all', 'specific')),
    formation_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_formateur ON promo_codes(formateur_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);

-- 3. Table des bundles/packs
CREATE TABLE IF NOT EXISTS bundles (
    id SERIAL PRIMARY KEY,
    formateur_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    formation_ids INTEGER[] NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    bundle_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bundles_formateur ON bundles(formateur_id);
CREATE INDEX IF NOT EXISTS idx_bundles_active ON bundles(is_active);

-- 4. Table des achats de bundles
CREATE TABLE IF NOT EXISTS bundle_purchases (
    id SERIAL PRIMARY KEY,
    bundle_id INTEGER NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price_paid DECIMAL(10,2) NOT NULL,
    purchased_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bundle_purchases_bundle ON bundle_purchases(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_purchases_buyer ON bundle_purchases(buyer_id);

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration terminée!';
    RAISE NOTICE 'Fonctionnalités ajoutées:';
    RAISE NOTICE '  - Vidéo de présentation YouTube';
    RAISE NOTICE '  - Certifications et diplômes';
    RAISE NOTICE '  - Codes promo';
    RAISE NOTICE '  - Bundles/Packs de formations';
    RAISE NOTICE '';
END $$;
