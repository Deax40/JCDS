/**
 * Migration: Add Formation Deletion Requests Table
 *
 * Crée la table pour gérer les demandes de suppression de formations
 */

-- Table des demandes de suppression de formations
CREATE TABLE IF NOT EXISTS formation_deletion_requests (
  id SERIAL PRIMARY KEY,
  formation_id INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_deletion_requests_formation_id ON formation_deletion_requests(formation_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON formation_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_requested_at ON formation_deletion_requests(requested_at DESC);

-- Commentaires
COMMENT ON TABLE formation_deletion_requests IS 'Demandes de suppression de formations par les formateurs';
COMMENT ON COLUMN formation_deletion_requests.formation_id IS 'ID de la formation à supprimer';
COMMENT ON COLUMN formation_deletion_requests.reason IS 'Raison de la suppression fournie par le formateur';
COMMENT ON COLUMN formation_deletion_requests.status IS 'Statut: pending, approved, rejected';
COMMENT ON COLUMN formation_deletion_requests.requested_at IS 'Date de la demande';
COMMENT ON COLUMN formation_deletion_requests.reviewed_at IS 'Date de traitement par admin';
COMMENT ON COLUMN formation_deletion_requests.reviewed_by IS 'ID de l''admin qui a traité';
COMMENT ON COLUMN formation_deletion_requests.admin_comment IS 'Commentaire de l''admin lors du traitement';

-- Vérifier si les colonnes deletion_requested existent dans formations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formations'
    AND column_name = 'deletion_requested'
  ) THEN
    ALTER TABLE formations ADD COLUMN deletion_requested BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Colonne deletion_requested ajoutée à formations';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formations'
    AND column_name = 'deletion_requested_at'
  ) THEN
    ALTER TABLE formations ADD COLUMN deletion_requested_at TIMESTAMP;
    RAISE NOTICE 'Colonne deletion_requested_at ajoutée à formations';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formations'
    AND column_name = 'deletion_reason'
  ) THEN
    ALTER TABLE formations ADD COLUMN deletion_reason TEXT;
    RAISE NOTICE 'Colonne deletion_reason ajoutée à formations';
  END IF;
END $$;

-- Commentaires pour les nouvelles colonnes formations
COMMENT ON COLUMN formations.deletion_requested IS 'Indique si une demande de suppression est en cours';
COMMENT ON COLUMN formations.deletion_requested_at IS 'Date de la demande de suppression';
COMMENT ON COLUMN formations.deletion_reason IS 'Raison de la demande de suppression';
