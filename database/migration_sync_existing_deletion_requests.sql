/**
 * Migration: Sync Existing Deletion Requests
 *
 * Crée des entrées dans formation_deletion_requests pour toutes les formations
 * qui ont deletion_requested = TRUE mais pas d'entrée correspondante
 */

-- Créer des demandes de suppression pour les formations qui en ont besoin
INSERT INTO formation_deletion_requests (formation_id, reason, status, requested_at)
SELECT
  f.id,
  COALESCE(f.deletion_reason, 'Demande de suppression') as reason,
  'pending' as status,
  COALESCE(f.deletion_requested_at, NOW()) as requested_at
FROM formations f
WHERE f.deletion_requested = TRUE
  AND f.is_active = FALSE
  AND NOT EXISTS (
    SELECT 1 FROM formation_deletion_requests fdr
    WHERE fdr.formation_id = f.id
    AND fdr.status = 'pending'
  );

-- Afficher le résultat
SELECT
  'Migration terminée: ' || COUNT(*) || ' demande(s) de suppression créée(s)' as message
FROM formation_deletion_requests
WHERE status = 'pending';
