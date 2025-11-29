/**
 * API Route: Check Subscription Status
 *
 * Vérifie si l'utilisateur actuel suit un formateur
 *
 * GET /api/subscriptions/check?formateurId=123
 */

import { query } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireAuth(req);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  const { formateurId } = req.query;

  if (!formateurId) {
    return res.status(400).json({ message: 'ID du formateur requis' });
  }

  try {
    const result = await query(
      `SELECT id FROM subscriptions WHERE follower_id = $1 AND following_id = $2`,
      [user.id, formateurId]
    );

    return res.status(200).json({
      isFollowing: result.rows.length > 0,
    });
  } catch (error) {
    console.error('Error checking subscription:', error);

    return res.status(500).json({
      message: 'Erreur lors de la vérification de l\'abonnement',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
