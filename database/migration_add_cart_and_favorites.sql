/**
 * Migration: Add Cart and Favorites System
 *
 * Permet aux utilisateurs d'ajouter des formations au panier et aux favoris
 */

-- Table pour le panier
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),

    -- Un utilisateur ne peut ajouter une formation qu'une seule fois au panier
    UNIQUE(user_id, formation_id)
);

-- Table pour les favoris
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),

    -- Un utilisateur ne peut ajouter une formation qu'une seule fois aux favoris
    UNIQUE(user_id, formation_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_formation ON cart_items(formation_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_added_at ON cart_items(added_at);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_formation ON favorites(formation_id);
CREATE INDEX IF NOT EXISTS idx_favorites_added_at ON favorites(added_at);

COMMENT ON TABLE cart_items IS 'Table gérant le panier d''achat des utilisateurs';
COMMENT ON TABLE favorites IS 'Table gérant les formations favorites des utilisateurs';
