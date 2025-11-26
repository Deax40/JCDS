/**
 * API Route: Get All Formateurs
 *
 * Endpoint pour récupérer tous les formateurs avec leurs statistiques
 *
 * GET /api/formateurs/all
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Récupérer tous les formateurs avec leurs statistiques
    const result = await query(
      `SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.pseudo,
        u.email,
        u.avatar_url,
        u.avatar_color,
        u.avatar_shape,
        u.bio,
        u.created_at,
        COUNT(DISTINCT f.id) as total_formations,
        COALESCE(SUM(f.total_sales), 0) as total_students,
        COALESCE(AVG(f.average_rating), 0) as global_rating,
        COALESCE(SUM(f.total_reviews), 0) as total_reviews
      FROM users u
      LEFT JOIN formations f ON u.id = f.seller_id AND f.is_published = TRUE
      WHERE 'formateur' = ANY(u.roles)
      GROUP BY u.id, u.first_name, u.last_name, u.pseudo, u.email, u.avatar_url, u.avatar_color, u.avatar_shape, u.bio, u.created_at
      ORDER BY total_formations DESC, total_students DESC`,
      []
    );

    const formateurs = result.rows.map(f => ({
      id: f.id,
      firstName: f.first_name,
      lastName: f.last_name,
      pseudo: f.pseudo,
      avatar: f.avatar_url,
      avatarColor: f.avatar_color || 'purple',
      avatarShape: f.avatar_shape || 'circle',
      bio: f.bio,
      memberSince: f.created_at,
      stats: {
        totalFormations: parseInt(f.total_formations) || 0,
        totalStudents: parseInt(f.total_students) || 0,
        globalRating: parseFloat(f.global_rating) || 0,
        totalReviews: parseInt(f.total_reviews) || 0,
      },
    }));

    return res.status(200).json({ formateurs });
  } catch (error) {
    console.error('Error fetching formateurs:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des formateurs',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
