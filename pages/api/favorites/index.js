/**
 * API Route: Get Favorites
 *
 * Récupère les formations favorites de l'utilisateur
 *
 * GET /api/favorites
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
        fav.id as favorite_id,
        fav.added_at,
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
      FROM favorites fav
      JOIN formations f ON fav.formation_id = f.id
      JOIN users u ON f.seller_id = u.id
      WHERE fav.user_id = $1 AND f.is_published = TRUE
      ORDER BY fav.added_at DESC`,
      [user.id]
    );

    const favorites = result.rows.map(item => ({
      favoriteId: item.favorite_id,
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

    return res.status(200).json({
      favorites,
      count: favorites.length,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des favoris',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
