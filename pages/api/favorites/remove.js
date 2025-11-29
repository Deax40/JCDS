/**
 * API Route: Remove from Favorites
 *
 * Retire une formation des favoris
 *
 * DELETE /api/favorites/remove
 */

import { query } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireAuth(req);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  const { formationId } = req.body;

  if (!formationId) {
    return res.status(400).json({ message: 'ID de la formation requis' });
  }

  try {
    const result = await query(
      `DELETE FROM favorites WHERE user_id = $1 AND formation_id = $2 RETURNING id`,
      [user.id, formationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée dans les favoris' });
    }

    return res.status(200).json({
      message: 'Formation retirée des favoris',
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);

    return res.status(500).json({
      message: 'Erreur lors du retrait des favoris',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
