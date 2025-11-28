/**
 * Migration: Ajout du système de demande de suppression
 *
 * Ajoute les colonnes nécessaires pour gérer les demandes de suppression
 * de formations qui nécessitent l'approbation d'un administrateur
 */

-- Ajouter les colonnes pour gérer les demandes de suppression
ALTER TABLE formations
ADD COLUMN IF NOT EXISTS deletion_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Créer une table pour l'historique des suppressions
CREATE TABLE IF NOT EXISTS formation_deletion_requests (
    id SERIAL PRIMARY KEY,
    formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    requester_id INTEGER NOT NULL REFERENCES users(id),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    requested_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    admin_comment TEXT
);

-- Index pour accélérer les requêtes
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON formation_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_formation ON formation_deletion_requests(formation_id);

-- Commentaires
COMMENT ON TABLE formation_deletion_requests IS 'Historique des demandes de suppression de formations';
COMMENT ON COLUMN formations.deletion_requested IS 'Indique si une demande de suppression est en attente';
COMMENT ON COLUMN formations.deletion_requested_at IS 'Date de la demande de suppression';
COMMENT ON COLUMN formations.deletion_reason IS 'Raison de la demande de suppression';
