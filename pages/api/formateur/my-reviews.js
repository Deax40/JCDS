/**
 * API Route: Get Formateur Reviews
 *
 * Endpoint pour récupérer tous les avis reçus par un formateur
 *
 * GET /api/formateur/my-reviews?sellerId=123
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sellerId } = req.query;

  if (!sellerId) {
    return res.status(400).json({ message: 'sellerId est requis' });
  }

  try {
    // Récupérer tous les avis pour les formations du formateur
    const reviewsResult = await query(
      `SELECT
        r.id, r.rating, r.comment, r.created_at,
        u.first_name, u.last_name, u.pseudo, u.avatar_url,
        f.title as formation_title, f.id as formation_id
      FROM reviews r
      JOIN users u ON r.buyer_id = u.id
      JOIN formations f ON r.formation_id = f.id
      WHERE f.seller_id = $1
      ORDER BY r.created_at DESC
      LIMIT 100`,
      [sellerId]
    );

    const reviews = reviewsResult.rows.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      buyer: {
        name: `${r.first_name} ${r.last_name}`,
        pseudo: r.pseudo,
        avatar: r.avatar_url,
      },
      formation: {
        id: r.formation_id,
        title: r.formation_title,
      },
    }));

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching formateur reviews:', error);

    // Si la table reviews n'existe pas encore, retourner un tableau vide
    if (error.code === '42P01') {
      return res.status(200).json({ reviews: [] });
    }

    return res.status(500).json({
      message: 'Erreur lors de la récupération des avis',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
