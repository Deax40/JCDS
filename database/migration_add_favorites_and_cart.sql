/**
 * Migration: Add Favorites and Cart Tables
 *
 * Crée les tables pour gérer les favoris et le panier
 */

-- Table des favoris
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, formation_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_formation_id ON favorites(formation_id);

COMMENT ON TABLE favorites IS 'Favoris des utilisateurs';
COMMENT ON COLUMN favorites.user_id IS 'ID de l''utilisateur';
COMMENT ON COLUMN favorites.formation_id IS 'ID de la formation ajoutée aux favoris';

-- Table du panier
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, formation_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_formation_id ON cart_items(formation_id);

COMMENT ON TABLE cart_items IS 'Articles du panier';
COMMENT ON COLUMN cart_items.user_id IS 'ID de l''utilisateur';
COMMENT ON COLUMN cart_items.formation_id IS 'ID de la formation dans le panier';
COMMENT ON COLUMN cart_items.added_at IS 'Date d''ajout au panier';
