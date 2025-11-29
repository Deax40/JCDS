/**
 * API Route: Get User Followers
 *
 * Récupère la liste des abonnés d'un utilisateur/formateur
 *
 * GET /api/subscriptions/followers/[userId]
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
    // Récupérer tous les followers avec leurs infos
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
        u.roles,
        s.created_at as followed_since
      FROM subscriptions s
      JOIN users u ON s.follower_id = u.id
      WHERE s.following_id = $1
      ORDER BY s.created_at DESC`,
      [userId]
    );

    const followers = result.rows.map(f => ({
      id: f.id,
      firstName: f.first_name,
      lastName: f.last_name,
      pseudo: f.pseudo,
      avatar: f.avatar_url,
      avatarColor: f.avatar_color || 'purple',
      avatarShape: f.avatar_shape || 'circle',
      bio: f.bio,
      isFormateur: f.roles && f.roles.includes('formateur'),
      followedSince: f.followed_since,
    }));

    return res.status(200).json({
      followers,
      count: followers.length,
    });
  } catch (error) {
    console.error('Error fetching followers:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des abonnés',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
