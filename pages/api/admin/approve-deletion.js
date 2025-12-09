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
    // Récupérer la demande de suppression avec les infos de la formation et du formateur
    const requestData = await query(
      `SELECT fdr.*, f.title, f.seller_id
       FROM formation_deletion_requests fdr
       JOIN formations f ON fdr.formation_id = f.id
       WHERE fdr.id = $1 AND fdr.status = $2`,
      [requestId, 'pending']
    );

    if (requestData.rows.length === 0) {
      return res.status(404).json({ message: 'Demande de suppression non trouvée ou déjà traitée' });
    }

    const deletionRequest = requestData.rows[0];
    const formationId = deletionRequest.formation_id;
    const formationTitle = deletionRequest.title;
    const sellerId = deletionRequest.seller_id;

    if (action === 'approve') {
      // Récupérer ou créer une conversation support avec le formateur
      let conversation = await query(
        `SELECT id FROM conversations WHERE type = 'support' AND user_id = $1`,
        [sellerId]
      );

      let conversationId;
      if (conversation.rows.length === 0) {
        const newConv = await query(
          `INSERT INTO conversations (type, user_id) VALUES ('support', $1) RETURNING id`,
          [sellerId]
        );
        conversationId = newConv.rows[0].id;
      } else {
        conversationId = conversation.rows[0].id;
      }

      // Envoyer un message automatique de confirmation
      const approvalMessage = `Votre demande de suppression pour la formation "${formationTitle}" a été approuvée par l'équipe FormationPlace.

La formation a été définitivement supprimée de la plateforme. La vente est maintenant annulée.

${adminComment ? `Commentaire de l'administrateur: ${adminComment}` : ''}

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe FormationPlace`;

      await query(
        `INSERT INTO messages (conversation_id, sender_id, message)
         VALUES ($1, $2, $3)`,
        [conversationId, admin.id, approvalMessage]
      );

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
        message: 'Formation supprimée avec succès et notification envoyée au formateur',
      });
    } else {
      // Récupérer ou créer une conversation support avec le formateur
      let conversation = await query(
        `SELECT id FROM conversations WHERE type = 'support' AND user_id = $1`,
        [sellerId]
      );

      let conversationId;
      if (conversation.rows.length === 0) {
        const newConv = await query(
          `INSERT INTO conversations (type, user_id) VALUES ('support', $1) RETURNING id`,
          [sellerId]
        );
        conversationId = newConv.rows[0].id;
      } else {
        conversationId = conversation.rows[0].id;
      }

      // Envoyer un message automatique de rejet
      const rejectionMessage = `Votre demande de suppression pour la formation "${formationTitle}" a été examinée par l'équipe FormationPlace.

Après vérification, nous avons décidé de rejeter cette demande. Votre formation a été remise en vente sur la plateforme.

${adminComment ? `Raison du rejet: ${adminComment}` : ''}

Si vous souhaitez toujours supprimer cette formation, veuillez nous contacter pour en discuter.

Cordialement,
L'équipe FormationPlace`;

      await query(
        `INSERT INTO messages (conversation_id, sender_id, message)
         VALUES ($1, $2, $3)`,
        [conversationId, admin.id, rejectionMessage]
      );

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
        message: 'Demande de suppression rejetée, formation remise en vente et notification envoyée au formateur',
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
