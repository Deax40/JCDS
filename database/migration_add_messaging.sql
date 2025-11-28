/**
 * Migration: Système de Messagerie
 *
 * Deux types de conversations:
 * 1. Support FormationPlace (type: 'support')
 * 2. Acheteur-Formateur (type: 'formation')
 */

-- Table des conversations
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('support', 'formation')),

    -- Pour les conversations support: user_id est l'utilisateur, admin_id peut être NULL au début
    -- Pour les conversations formation: user_id est l'acheteur, seller_id est le formateur
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    formation_id INTEGER REFERENCES formations(id) ON DELETE CASCADE,

    -- Métadonnées
    last_message_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),

    -- Le support doit avoir user_id uniquement
    -- Les conversations formation doivent avoir user_id, seller_id ET formation_id
    CONSTRAINT check_conversation_type CHECK (
        (type = 'support' AND seller_id IS NULL AND formation_id IS NULL) OR
        (type = 'formation' AND seller_id IS NOT NULL AND formation_id IS NOT NULL)
    )
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Contenu
    message TEXT NOT NULL,

    -- Statut
    is_read BOOLEAN DEFAULT FALSE,

    -- Métadonnées
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT message_not_empty CHECK (LENGTH(TRIM(message)) > 0)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller ON conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_formation ON conversations(formation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(is_read) WHERE is_read = FALSE;

-- Fonction pour mettre à jour last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement last_message_at
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON messages;
CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- Commentaires pour documentation
COMMENT ON TABLE conversations IS 'Table des conversations: support (utilisateur-FormationPlace) ou formation (acheteur-formateur)';
COMMENT ON TABLE messages IS 'Table des messages dans les conversations';
COMMENT ON COLUMN conversations.type IS 'Type: support ou formation';
COMMENT ON COLUMN conversations.user_id IS 'Utilisateur (acheteur pour formation, utilisateur pour support)';
COMMENT ON COLUMN conversations.seller_id IS 'Formateur (NULL pour support)';
COMMENT ON COLUMN conversations.formation_id IS 'Formation concernée (NULL pour support)';
