/**
 * Migration: Add seller_id to formation_deletion_requests
 *
 * Ajoute une colonne seller_id dans formation_deletion_requests
 * pour conserver l'information du vendeur même après suppression de la formation
 */

-- Ajouter la colonne seller_id si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formation_deletion_requests'
    AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE formation_deletion_requests
    ADD COLUMN seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

    RAISE NOTICE 'Colonne seller_id ajoutée à formation_deletion_requests';
  ELSE
    RAISE NOTICE 'Colonne seller_id existe déjà dans formation_deletion_requests';
  END IF;
END $$;

-- Remplir seller_id pour les demandes existantes où la formation existe encore
UPDATE formation_deletion_requests fdr
SET seller_id = f.seller_id
FROM formations f
WHERE fdr.formation_id = f.id
  AND fdr.seller_id IS NULL;

-- Créer un trigger pour remplir automatiquement seller_id lors de l'insertion
CREATE OR REPLACE FUNCTION set_deletion_request_seller()
RETURNS TRIGGER AS $$
BEGIN
  -- Récupérer le seller_id depuis la formation
  SELECT seller_id INTO NEW.seller_id
  FROM formations
  WHERE id = NEW.formation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger s'il n'existe pas
DROP TRIGGER IF EXISTS trigger_set_deletion_request_seller ON formation_deletion_requests;
CREATE TRIGGER trigger_set_deletion_request_seller
  BEFORE INSERT ON formation_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_deletion_request_seller();

-- Commentaires
COMMENT ON COLUMN formation_deletion_requests.seller_id IS 'ID du vendeur (formateur) - conservé même après suppression de la formation';
