/**
 * API Route: Check Purchase Status
 *
 * Vérifie si l'utilisateur connecté a acheté une formation spécifique
 *
 * GET /api/purchases/check?formationId=123
 */

import { query } from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(200).json({ hasPurchased: false });
  }

  const { formationId } = req.query;

  if (!formationId) {
    return res.status(400).json({ message: 'Formation ID requis' });
  }

  try {
    const result = await query(
      `SELECT id FROM purchases
       WHERE buyer_id = $1 AND formation_id = $2
       LIMIT 1`,
      [user.id, formationId]
    );

    return res.status(200).json({
      hasPurchased: result.rows.length > 0,
    });
  } catch (error) {
    console.error('Error checking purchase:', error);

    return res.status(500).json({
      message: 'Erreur lors de la vérification',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
