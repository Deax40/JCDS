/**
 * API Route: Homepage Formations
 *
 * Récupère les formations pour la page d'accueil
 * - Formations populaires (les plus vendues/vues)
 * - Formations récentes
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Récupérer les formations populaires (les plus vendues)
    const popularFormations = await query(
      `SELECT
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.price_ttc,
        f.quantity_sold,
        f.created_at,
        f.formation_type,
        u.id as seller_id,
        u.pseudo as seller_name,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      LEFT JOIN reviews r ON f.id = r.formation_id
      WHERE f.is_published = TRUE AND f.is_active = TRUE
      GROUP BY f.id, u.id
      ORDER BY f.quantity_sold DESC, f.created_at DESC
      LIMIT 8`,
      []
    );

    // Récupérer les formations récentes
    const recentFormations = await query(
      `SELECT
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.price_ttc,
        f.quantity_sold,
        f.created_at,
        f.formation_type,
        u.id as seller_id,
        u.pseudo as seller_name,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      LEFT JOIN reviews r ON f.id = r.formation_id
      WHERE f.is_published = TRUE AND f.is_active = TRUE
      GROUP BY f.id, u.id
      ORDER BY f.created_at DESC
      LIMIT 8`,
      []
    );

    // Formater les données pour le frontend
    const formatFormations = (rows) => {
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category_name: row.category_slug,
        price: parseFloat(row.price_ttc),
        promo_price: null,
        is_promo_active: false,
        average_rating: parseFloat(row.average_rating),
        seller_name: row.seller_name || `${row.seller_prenom} ${row.seller_nom}`,
        seller_id: row.seller_id,
        total_sales: row.quantity_sold || 0,
        total_capacity: 100,
        level: 'Tous niveaux',
        is_new: (new Date() - new Date(row.created_at)) < 7 * 24 * 60 * 60 * 1000, // Nouveau si moins de 7 jours
        formation_type: row.formation_type,
        total_reviews: parseInt(row.total_reviews) || 0,
      }));
    };

    return res.status(200).json({
      popular: formatFormations(popularFormations.rows),
      recent: formatFormations(recentFormations.rows),
    });
  } catch (error) {
    console.error('Error fetching homepage formations:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des formations',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
