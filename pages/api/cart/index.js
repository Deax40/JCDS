/**
 * API Route: Cart
 *
 * Gère le panier de l'utilisateur
 *
 * GET /api/cart - Liste des articles du panier
 * POST /api/cart - Ajouter au panier
 * DELETE /api/cart - Retirer du panier
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
          c.id as cart_item_id,
          fo.id,
          fo.title,
          fo.description,
          fo.category_slug,
          fo.price_ttc,
          fo.price_net,
          fo.formation_type,
          fo.average_rating,
          fo.total_reviews,
          fo.seller_id,
          u.prenom as seller_prenom,
          u.nom as seller_nom,
          u.pseudo as seller_pseudo,
          c.added_at
        FROM cart_items c
        JOIN formations fo ON c.formation_id = fo.id
        JOIN users u ON fo.seller_id = u.id
        WHERE c.user_id = $1
        ORDER BY c.added_at DESC`,
        [user.id]
      );

      const total = result.rows.reduce((sum, item) => sum + parseFloat(item.price_ttc), 0);

      return res.status(200).json({ 
        cart: result.rows,
        total: total.toFixed(2),
        count: result.rows.length
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
  }

  if (req.method === 'POST') {
    const { formationId } = req.body;

    if (!formationId) {
      return res.status(400).json({ message: 'Formation ID requis' });
    }

    try {
      // Vérifier si déjà acheté
      const purchased = await query(
        `SELECT 1 FROM purchases WHERE user_id = $1 AND formation_id = $2`,
        [user.id, formationId]
      );

      if (purchased.rows.length > 0) {
        return res.status(400).json({ message: 'Vous possédez déjà cette formation' });
      }

      await query(
        `INSERT INTO cart_items (user_id, formation_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, formation_id) DO NOTHING`,
        [user.id, formationId]
      );

      return res.status(200).json({ message: 'Ajouté au panier' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
    }
  }

  if (req.method === 'DELETE') {
    const { formationId } = req.body;

    if (!formationId) {
      return res.status(400).json({ message: 'Formation ID requis' });
    }

    try {
      await query(
        `DELETE FROM cart_items WHERE user_id = $1 AND formation_id = $2`,
        [user.id, formationId]
      );

      return res.status(200).json({ message: 'Retiré du panier' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
