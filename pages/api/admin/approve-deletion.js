/**
 * API Route: Approve/Reject Formation Deletion
 *
 * Permet à l'admin d'approuver ou rejeter une demande de suppression
 *
 * POST /api/admin/approve-deletion
 * Body: { requestId, action: 'approve' | 'reject', adminComment? }
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Vérifier que l'utilisateur est admin
  const cookies = cookie.parse(req.headers.cookie || '');
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  let admin;
  try {
    admin = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  if (!admin.roles || !admin.roles.includes('admin')) {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }

  const { requestId, action, adminComment } = req.body;

  if (!requestId || !action) {
    return res.status(400).json({ message: 'Request ID et action requis' });
  }

  if (action !== 'approve' && action !== 'reject') {
    return res.status(400).json({ message: 'Action invalide (approve ou reject)' });
  }

  try {
    // Récupérer la demande de suppression
    const requestData = await query(
      'SELECT * FROM formation_deletion_requests WHERE id = $1 AND status = $2',
      [requestId, 'pending']
    );

    if (requestData.rows.length === 0) {
      return res.status(404).json({ message: 'Demande de suppression non trouvée ou déjà traitée' });
    }

    const deletionRequest = requestData.rows[0];
    const formationId = deletionRequest.formation_id;

    if (action === 'approve') {
      // APPROUVER: Supprimer définitivement la formation
      await query('DELETE FROM formations WHERE id = $1', [formationId]);

      // Mettre à jour la demande
      await query(
        `UPDATE formation_deletion_requests
         SET status = $1, reviewed_at = NOW(), reviewed_by = $2, admin_comment = $3
         WHERE id = $4`,
        ['approved', admin.id, adminComment, requestId]
      );

      return res.status(200).json({
        success: true,
        message: 'Formation supprimée avec succès',
      });
    } else {
      // REJETER: Remettre la formation en vente
      await query(
        `UPDATE formations
         SET is_active = TRUE, deletion_requested = FALSE, deletion_requested_at = NULL, deletion_reason = NULL
         WHERE id = $1`,
        [formationId]
      );

      // Mettre à jour la demande
      await query(
        `UPDATE formation_deletion_requests
         SET status = $1, reviewed_at = NOW(), reviewed_by = $2, admin_comment = $3
         WHERE id = $4`,
        ['rejected', admin.id, adminComment, requestId]
      );

      return res.status(200).json({
        success: true,
        message: 'Demande de suppression rejetée - Formation remise en vente',
      });
    }
  } catch (error) {
    console.error('Error processing deletion request:', error);
    return res.status(500).json({
      message: 'Erreur lors du traitement de la demande',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
