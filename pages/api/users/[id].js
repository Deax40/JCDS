/**
 * API Route: Get User Info
 *
 * Récupère les informations publiques d'un utilisateur
 *
 * GET /api/users/[id]
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID utilisateur requis' });
  }

  try {
    const result = await query(
      `SELECT
        id,
        first_name,
        last_name,
        pseudo,
        avatar_url,
        avatar_color,
        avatar_shape,
        bio,
        roles,
        followers_count,
        following_count,
        created_at
      FROM users
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const userRow = result.rows[0];

    return res.status(200).json({
      user: {
        id: userRow.id,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        pseudo: userRow.pseudo,
        avatar: userRow.avatar_url,
        avatarColor: userRow.avatar_color || 'purple',
        avatarShape: userRow.avatar_shape || 'circle',
        bio: userRow.bio,
        roles: userRow.roles || [],
        followersCount: userRow.followers_count || 0,
        followingCount: userRow.following_count || 0,
        memberSince: userRow.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération de l\'utilisateur',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
