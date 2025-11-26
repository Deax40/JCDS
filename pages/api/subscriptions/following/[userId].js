/**
 * API Route: Get User Following
 *
 * Récupère la liste des formateurs suivis par un utilisateur
 *
 * GET /api/subscriptions/following/[userId]
 */

import { query } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'ID utilisateur requis' });
  }

  try {
    // Récupérer tous les formateurs suivis avec leurs infos
    const result = await query(
      `SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.pseudo,
        u.avatar_url,
        u.avatar_color,
        u.avatar_shape,
        u.bio,
        u.followers_count,
        s.created_at as following_since,
        COUNT(DISTINCT f.id) as total_formations
      FROM subscriptions s
      JOIN users u ON s.following_id = u.id
      LEFT JOIN formations f ON u.id = f.seller_id AND f.is_published = TRUE
      WHERE s.follower_id = $1 AND 'formateur' = ANY(u.roles)
      GROUP BY u.id, u.first_name, u.last_name, u.pseudo, u.avatar_url, u.avatar_color, u.avatar_shape, u.bio, u.followers_count, s.created_at
      ORDER BY s.created_at DESC`,
      [userId]
    );

    const following = result.rows.map(f => ({
      id: f.id,
      firstName: f.first_name,
      lastName: f.last_name,
      pseudo: f.pseudo,
      avatar: f.avatar_url,
      avatarColor: f.avatar_color || 'purple',
      avatarShape: f.avatar_shape || 'circle',
      bio: f.bio,
      followersCount: f.followers_count || 0,
      totalFormations: parseInt(f.total_formations) || 0,
      followingSince: f.following_since,
    }));

    return res.status(200).json({
      following,
      count: following.length,
    });
  } catch (error) {
    console.error('Error fetching following:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des abonnements',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
