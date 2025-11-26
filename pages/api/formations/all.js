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
        f.total_sales,
        f.average_rating,
        f.total_reviews,
        f.created_at,
        u.id as seller_id,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.pseudo as seller_pseudo,
        u.avatar_url as seller_avatar
      FROM formations f
      JOIN users u ON f.seller_id = u.id
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

    // Tri
    switch (sortBy) {
      case 'popular':
        sqlQuery += ' ORDER BY f.total_sales DESC';
        break;
      case 'rating':
        sqlQuery += ' ORDER BY f.average_rating DESC, f.total_reviews DESC';
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

    // Formater les formations
    const formations = result.rows.map(f => {
      const category = getCategoryBySlug(f.category_slug);

      return {
        id: f.id,
        title: f.title,
        description: f.description,
        category: {
          slug: f.category_slug,
          name: category?.name || f.category_slug,
          gradient: category?.gradient || 'from-gray-500 to-gray-700',
          icon: category?.icon || 'ph-book',
        },
        tags: f.tags || [],
        type: f.formation_type,
        priceTTC: parseFloat(f.price_ttc),
        priceNet: parseFloat(f.price_net),
        totalSales: f.total_sales,
        averageRating: parseFloat(f.average_rating) || 0,
        totalReviews: f.total_reviews,
        createdAt: f.created_at,
        isNew: new Date() - new Date(f.created_at) < 7 * 24 * 60 * 60 * 1000, // Moins de 7 jours
        seller: {
          id: f.seller_id,
          firstName: f.seller_first_name,
          lastName: f.seller_last_name,
          pseudo: f.seller_pseudo,
          avatar: f.seller_avatar,
        },
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
