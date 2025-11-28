/**
 * API Route: Get All Formations
 *
 * Endpoint pour récupérer toutes les formations publiées avec filtres
 *
 * GET /api/formations/all?category=slug&sortBy=recent&limit=20
 */

import { query } from '../../../lib/db';
import { getCategoryBySlug } from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    category = 'all',
    sortBy = 'recent',
    limit = 50,
    offset = 0,
    isNew = false, // Filtre pour formations de moins de 7 jours
  } = req.query;

  try {
    // Construire la requête SQL
    let sqlQuery = `
      SELECT
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.tags,
        f.formation_type,
        f.price_ttc,
        f.price_net,
        f.quantity_sold,
        f.created_at,
        u.id as seller_id,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        u.pseudo as seller_pseudo,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      LEFT JOIN reviews r ON f.id = r.formation_id
      WHERE f.is_published = TRUE AND f.is_active = TRUE
    `;

    const params = [];
    let paramCount = 1;

    // Filtre par catégorie
    if (category && category !== 'all') {
      sqlQuery += ` AND f.category_slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Filtre formations récentes (moins de 7 jours)
    if (isNew === 'true' || isNew === true) {
      sqlQuery += ` AND f.created_at >= NOW() - INTERVAL '7 days'`;
    }

    // GROUP BY pour l'agrégation
    sqlQuery += ` GROUP BY f.id, u.id`;

    // Tri
    switch (sortBy) {
      case 'popular':
        sqlQuery += ' ORDER BY f.quantity_sold DESC';
        break;
      case 'rating':
        sqlQuery += ' ORDER BY average_rating DESC, total_reviews DESC';
        break;
      case 'price_asc':
        sqlQuery += ' ORDER BY f.price_ttc ASC';
        break;
      case 'price_desc':
        sqlQuery += ' ORDER BY f.price_ttc DESC';
        break;
      case 'recent':
      default:
        sqlQuery += ' ORDER BY f.created_at DESC';
        break;
    }

    // Pagination
    sqlQuery += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sqlQuery, params);

    // Formater les formations pour le frontend (format compatible FormationCardAnvogue)
    const formations = result.rows.map(f => {
      const categoryData = getCategoryBySlug(f.category_slug);

      return {
        id: f.id,
        title: f.title,
        description: f.description,
        category_name: categoryData?.name || f.category_slug,
        category_slug: f.category_slug,
        tags: f.tags || [],
        formation_type: f.formation_type,
        price: parseFloat(f.price_ttc),
        promo_price: null,
        is_promo_active: false,
        total_sales: f.quantity_sold || 0,
        total_capacity: 100,
        average_rating: parseFloat(f.average_rating) || 0,
        total_reviews: parseInt(f.total_reviews) || 0,
        seller_name: f.seller_pseudo || `${f.seller_prenom} ${f.seller_nom}`,
        seller_id: f.seller_id,
        level: 'Tous niveaux',
        is_new: (new Date() - new Date(f.created_at)) < 7 * 24 * 60 * 60 * 1000,
        created_at: f.created_at,
      };
    });

    return res.status(200).json({ formations });
  } catch (error) {
    console.error('Error fetching formations:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des formations',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
