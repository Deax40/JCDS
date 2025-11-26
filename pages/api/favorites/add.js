/**
 * API Route: Add to Favorites
 *
 * Ajoute une formation aux favoris
 *
 * POST /api/favorites/add
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

  const { formationId } = req.body;

  if (!formationId) {
    return res.status(400).json({ message: 'ID de la formation requis' });
  }

  try {
    // Vérifier que la formation existe et est publiée
    const formationCheck = await query(
      `SELECT id FROM formations WHERE id = $1 AND is_published = TRUE`,
      [formationId]
    );

    if (formationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // Vérifier si la formation est déjà dans les favoris
    const favoriteCheck = await query(
      `SELECT id FROM favorites WHERE user_id = $1 AND formation_id = $2`,
      [user.id, formationId]
    );

    if (favoriteCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Cette formation est déjà dans vos favoris' });
    }

    // Ajouter aux favoris
    await query(
      `INSERT INTO favorites (user_id, formation_id, added_at)
       VALUES ($1, $2, NOW())`,
      [user.id, formationId]
    );

    return res.status(200).json({
      message: 'Formation ajoutée aux favoris',
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);

    return res.status(500).json({
      message: 'Erreur lors de l\'ajout aux favoris',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
