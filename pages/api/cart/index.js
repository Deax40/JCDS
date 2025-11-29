/**
 * API Route: Get Cart
 *
 * Récupère le panier de l'utilisateur avec les détails des formations
 *
 * GET /api/cart
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

  try {
    const result = await query(
      `SELECT
        c.id as cart_item_id,
        c.added_at,
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.price_ttc,
        f.price_net,
        f.formation_type,
        f.average_rating,
        f.total_reviews,
        f.seller_id,
        u.pseudo as seller_pseudo,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.avatar_url as seller_avatar,
        u.avatar_color as seller_avatar_color,
        u.avatar_shape as seller_avatar_shape
      FROM cart_items c
      JOIN formations f ON c.formation_id = f.id
      JOIN users u ON f.seller_id = u.id
      WHERE c.user_id = $1 AND f.is_published = TRUE
      ORDER BY c.added_at DESC`,
      [user.id]
    );

    const cartItems = result.rows.map(item => ({
      cartItemId: item.cart_item_id,
      addedAt: item.added_at,
      formation: {
        id: item.id,
        title: item.title,
        description: item.description,
        categorySlug: item.category_slug,
        priceTTC: parseFloat(item.price_ttc),
        priceNet: parseFloat(item.price_net),
        type: item.formation_type,
        averageRating: parseFloat(item.average_rating) || 0,
        totalReviews: item.total_reviews,
        seller: {
          id: item.seller_id,
          pseudo: item.seller_pseudo,
          firstName: item.seller_first_name,
          lastName: item.seller_last_name,
          avatar: item.seller_avatar,
          avatarColor: item.seller_avatar_color,
          avatarShape: item.seller_avatar_shape,
        },
      },
    }));

    const total = cartItems.reduce((sum, item) => sum + item.formation.priceTTC, 0);

    return res.status(200).json({
      items: cartItems,
      total: total.toFixed(2),
      count: cartItems.length,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération du panier',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
