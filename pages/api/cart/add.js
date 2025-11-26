/**
 * API Route: Add to Cart
 *
 * Ajoute une formation au panier
 *
 * POST /api/cart/add
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
      `SELECT id, seller_id FROM formations WHERE id = $1 AND is_published = TRUE`,
      [formationId]
    );

    if (formationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // Empêcher l'ajout de sa propre formation
    if (formationCheck.rows[0].seller_id === user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas acheter votre propre formation' });
    }

    // Vérifier si l'utilisateur a déjà acheté cette formation
    const purchaseCheck = await query(
      `SELECT id FROM purchases WHERE buyer_id = $1 AND formation_id = $2`,
      [user.id, formationId]
    );

    if (purchaseCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Vous possédez déjà cette formation' });
    }

    // Vérifier si la formation est déjà dans le panier
    const cartCheck = await query(
      `SELECT id FROM cart_items WHERE user_id = $1 AND formation_id = $2`,
      [user.id, formationId]
    );

    if (cartCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Cette formation est déjà dans votre panier' });
    }

    // Ajouter au panier
    await query(
      `INSERT INTO cart_items (user_id, formation_id, added_at)
       VALUES ($1, $2, NOW())`,
      [user.id, formationId]
    );

    return res.status(200).json({
      message: 'Formation ajoutée au panier',
    });
  } catch (error) {
    console.error('Error adding to cart:', error);

    return res.status(500).json({
      message: 'Erreur lors de l\'ajout au panier',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
