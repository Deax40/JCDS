/**
 * API Route: Favorites
 *
 * Gère les favoris de l'utilisateur
 *
 * GET /api/favorites - Liste des favoris
 * POST /api/favorites - Ajouter aux favoris
 * DELETE /api/favorites - Retirer des favoris
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT
          f.id as favorite_id,
          fo.id,
          fo.title,
          fo.description,
          fo.category_slug,
          fo.price_ttc,
          fo.price_net,
          fo.formation_type,
          fo.average_rating,
          fo.total_reviews,
          fo.total_sales,
          fo.seller_id,
          u.prenom as seller_prenom,
          u.nom as seller_nom,
          u.pseudo as seller_pseudo
        FROM favorites f
        JOIN formations fo ON f.formation_id = fo.id
        JOIN users u ON fo.seller_id = u.id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC`,
        [user.id]
      );

      return res.status(200).json({ favorites: result.rows });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des favoris' });
    }
  }

  if (req.method === 'POST') {
    const { formationId } = req.body;

    if (!formationId) {
      return res.status(400).json({ message: 'Formation ID requis' });
    }

    try {
      await query(
        `INSERT INTO favorites (user_id, formation_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, formation_id) DO NOTHING`,
        [user.id, formationId]
      );

      return res.status(200).json({ message: 'Ajouté aux favoris' });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris' });
    }
  }

  if (req.method === 'DELETE') {
    const { formationId } = req.body;

    if (!formationId) {
      return res.status(400).json({ message: 'Formation ID requis' });
    }

    try {
      await query(
        `DELETE FROM favorites WHERE user_id = $1 AND formation_id = $2`,
        [user.id, formationId]
      );

      return res.status(200).json({ message: 'Retiré des favoris' });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
