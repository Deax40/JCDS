-- ===========================================
-- SCHÉMA DE BASE DE DONNÉES - MARKETPLACE DE FORMATIONS
-- ===========================================
-- À exécuter sur votre base PostgreSQL hébergée (Supabase, Neon, Vercel Postgres)

-- Table: users (tous les utilisateurs - acheteurs et formateurs)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) NOT NULL DEFAULT 'buyer', -- 'buyer' ou 'seller'
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(50),
  website_url TEXT,
  linkedin_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: seller_profiles (profils spécifiques des formateurs/vendeurs)
CREATE TABLE seller_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(150) NOT NULL,
  bio_short TEXT,
  bio_long TEXT,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0.00,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories (catégories de formations)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_class VARCHAR(100), -- Pour les classes d'icônes (ex: flaticon-xxx)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: formations (les formations créées par les vendeurs)
CREATE TABLE formations (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description_short TEXT,
  description_long TEXT,
  cover_image_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  promo_price DECIMAL(10, 2),
  is_promo_active BOOLEAN DEFAULT FALSE,
  tags TEXT[], -- Tableau de tags
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  total_sales INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: orders (commandes d'achat)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  platform_commission DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method VARCHAR(50) DEFAULT 'sumup',
  sumup_transaction_id VARCHAR(255),
  sumup_checkout_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: order_items (détails des formations achetées dans chaque commande)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  price_paid DECIMAL(10, 2) NOT NULL,
  platform_commission DECIMAL(10, 2) NOT NULL,
  seller_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reviews (avis et notes laissés par les acheteurs)
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer_id, formation_id, order_id) -- Un acheteur ne peut laisser qu'un avis par formation par commande
);

-- Table: cart (panier temporaire des acheteurs)
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, formation_id)
);

-- Table: seller_payouts (historique des paiements aux vendeurs)
CREATE TABLE seller_payouts (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payout_method VARCHAR(50),
  transaction_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: subscriptions (pour futurs abonnements)
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- ===========================================

CREATE INDEX idx_formations_seller ON formations(seller_id);
CREATE INDEX idx_formations_category ON formations(category_id);
CREATE INDEX idx_formations_active ON formations(is_active, is_published);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_formation ON order_items(formation_id);
CREATE INDEX idx_reviews_formation ON reviews(formation_id);
CREATE INDEX idx_reviews_seller ON reviews(seller_id);
CREATE INDEX idx_cart_user ON cart(user_id);

-- ===========================================
-- FONCTIONS TRIGGER POUR MISE À JOUR AUTOMATIQUE
-- ===========================================

-- Fonction pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON formations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer la note moyenne d'une formation
CREATE OR REPLACE FUNCTION update_formation_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE formations
  SET
    average_rating = (SELECT AVG(rating) FROM reviews WHERE formation_id = NEW.formation_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE formation_id = NEW.formation_id)
  WHERE id = NEW.formation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_formation_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_formation_rating();

-- Fonction pour calculer la note moyenne d'un vendeur
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE seller_profiles
  SET
    average_rating = (SELECT AVG(rating) FROM reviews WHERE seller_id = NEW.seller_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE seller_id = NEW.seller_id)
  WHERE user_id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seller_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

-- ===========================================
-- DONNÉES D'EXEMPLE (OPTIONNEL - pour tester)
-- ===========================================

-- Catégories par défaut
INSERT INTO categories (name, slug, description) VALUES
('Développement Web', 'developpement-web', 'Formations en développement web et programmation'),
('Business & Marketing', 'business-marketing', 'Formations en business, marketing et vente'),
('Design', 'design', 'Formations en design graphique, UI/UX'),
('Photographie', 'photographie', 'Formations en photographie et retouche photo'),
('Développement Personnel', 'developpement-personnel', 'Formations en développement personnel et soft skills');

-- Utilisateur admin de test (mot de passe: admin123)
-- ATTENTION: À supprimer ou changer en production !
INSERT INTO users (email, password_hash, first_name, last_name, role, is_email_verified) VALUES
('admin@formationplace.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'FormationPlace', 'seller', TRUE);
