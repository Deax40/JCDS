-- Migration: Création de la table purchases pour tracker les achats
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-25

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

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Migration terminée!';
    RAISE NOTICE 'Table purchases créée avec succès';
    RAISE NOTICE 'Les achats sont maintenant trackés et les statistiques de formations sont automatiquement mises à jour';
END $$;
