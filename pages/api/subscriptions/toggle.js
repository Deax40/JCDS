/**
 * API Route: Toggle Subscription
 *
 * Permet de s'abonner ou se désabonner d'un formateur
 *
 * POST /api/subscriptions/toggle
 */

import { query } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireAuth(req);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  const { formateurId } = req.body;

  if (!formateurId) {
    return res.status(400).json({ message: 'ID du formateur requis' });
  }

  // Empêcher de se suivre soi-même
  if (parseInt(formateurId) === user.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas vous abonner à vous-même' });
  }

  try {
    // Vérifier que le formateur existe et a bien le rôle formateur
    const formateurCheck = await query(
      `SELECT id FROM users WHERE id = $1 AND 'formateur' = ANY(roles)`,
      [formateurId]
    );

    if (formateurCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Formateur non trouvé' });
    }

    // Vérifier si l'abonnement existe déjà
    const existingSubscription = await query(
      `SELECT id FROM subscriptions WHERE follower_id = $1 AND following_id = $2`,
      [user.id, formateurId]
    );

    if (existingSubscription.rows.length > 0) {
      // Désabonnement
      await query(
        `DELETE FROM subscriptions WHERE follower_id = $1 AND following_id = $2`,
        [user.id, formateurId]
      );

      return res.status(200).json({
        message: 'Désabonnement réussi',
        isFollowing: false,
      });
    } else {
      // Abonnement
      await query(
        `INSERT INTO subscriptions (follower_id, following_id, created_at)
         VALUES ($1, $2, NOW())`,
        [user.id, formateurId]
      );

      return res.status(200).json({
        message: 'Abonnement réussi',
        isFollowing: true,
      });
    }
  } catch (error) {
    console.error('Error toggling subscription:', error);

    return res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'abonnement',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
