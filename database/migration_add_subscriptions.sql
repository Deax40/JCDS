/**
 * Migration: Add Subscriptions/Follow System
 *
 * Permet aux utilisateurs de s'abonner aux formateurs
 * - Table subscriptions pour gérer les abonnements
 * - Statistiques de followers/following
 */

-- Créer la table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Un utilisateur ne peut suivre un formateur qu'une seule fois
    UNIQUE(follower_id, following_id),

    -- Un utilisateur ne peut pas se suivre lui-même
    CHECK (follower_id != following_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_follower ON subscriptions(follower_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_following ON subscriptions(following_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);

-- Ajouter des colonnes de compteurs dans la table users (optionnel, pour performance)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'followers_count'
    ) THEN
        ALTER TABLE users ADD COLUMN followers_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'following_count'
    ) THEN
        ALTER TABLE users ADD COLUMN following_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Fonction pour mettre à jour les compteurs automatiquement
CREATE OR REPLACE FUNCTION update_subscription_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Incrémenter followers_count pour le formateur
        UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
        -- Incrémenter following_count pour le follower
        UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Décrémenter followers_count pour le formateur
        UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
        -- Décrémenter following_count pour le follower
        UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_update_subscription_counts ON subscriptions;
CREATE TRIGGER trigger_update_subscription_counts
    AFTER INSERT OR DELETE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_counts();

-- Initialiser les compteurs pour les utilisateurs existants
UPDATE users SET followers_count = (
    SELECT COUNT(*) FROM subscriptions WHERE following_id = users.id
);

UPDATE users SET following_count = (
    SELECT COUNT(*) FROM subscriptions WHERE follower_id = users.id
);

COMMENT ON TABLE subscriptions IS 'Table gérant les abonnements entre utilisateurs et formateurs';
COMMENT ON COLUMN subscriptions.follower_id IS 'ID de l''utilisateur qui suit';
COMMENT ON COLUMN subscriptions.following_id IS 'ID du formateur suivi';
