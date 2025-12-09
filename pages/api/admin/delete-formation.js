/**
 * API Route: Delete Formation (Direct Admin Action)
 *
 * Permet à l'admin de supprimer directement une formation
 * et d'envoyer un message automatique au formateur
 *
 * POST /api/admin/delete-formation
 * Body: { formationId, reason }
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

  const { formationId, reason } = req.body;

  if (!formationId) {
    return res.status(400).json({ message: 'Formation ID requis' });
  }

  try {
    // Récupérer les infos de la formation et du formateur
    const formationData = await query(
      `SELECT f.id, f.title, f.seller_id, u.prenom, u.nom
       FROM formations f
       JOIN users u ON f.seller_id = u.id
       WHERE f.id = $1`,
      [formationId]
    );

    if (formationData.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const formation = formationData.rows[0];
    const formationTitle = formation.title;
    const sellerId = formation.seller_id;

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

    // Envoyer un message automatique de notification
    const deletionMessage = `Votre formation "${formationTitle}" a été supprimée par l'équipe FormationPlace.

${reason ? `Raison: ${reason}` : 'Cette suppression a été effectuée suite à une décision administrative.'}

La formation a été définitivement retirée de la plateforme et la vente est maintenant annulée.

Si vous avez des questions concernant cette suppression, n'hésitez pas à nous contacter.

Cordialement,
L'équipe FormationPlace`;

    await query(
      `INSERT INTO messages (conversation_id, sender_id, message)
       VALUES ($1, $2, $3)`,
      [conversationId, admin.id, deletionMessage]
    );

    // Supprimer la formation
    await query('DELETE FROM formations WHERE id = $1', [formationId]);

    return res.status(200).json({
      success: true,
      message: 'Formation supprimée avec succès et notification envoyée au formateur',
    });
  } catch (error) {
    console.error('Error deleting formation:', error);
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la formation',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
