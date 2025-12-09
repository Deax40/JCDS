/**
 * API Route: Get Formateur Formations
 *
 * Endpoint pour récupérer les formations d'un formateur
 *
 * GET /api/formateur/my-formations?sellerId=123
 */

import { query } from '../../../lib/db';
import { getCategoryBySlug } from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sellerId } = req.query;

  if (!sellerId) {
    return res.status(400).json({ message: 'sellerId est requis' });
  }

  try {
    // Récupérer les formations du formateur
    const formationsResult = await query(
      `SELECT
        id, category_slug, title, description, tags,
        formation_type, visio_date, visio_duration,
        has_time_limit, time_limit_date,
        has_quantity_limit, quantity_limit, quantity_sold,
        price_ttc, price_net,
        total_sales, total_revenue, average_rating, total_reviews,
        is_active, is_published, created_at, updated_at,
        deletion_requested, deletion_requested_at, deletion_reason
      FROM formations
      WHERE seller_id = $1
      ORDER BY created_at DESC`,
      [sellerId]
    );

    // Calculer les statistiques globales
    const statsResult = await query(
      `SELECT
        COUNT(*) as total_formations,
        SUM(total_sales) as total_students,
        SUM(total_revenue) as total_revenue,
        AVG(average_rating) as global_rating,
        SUM(total_reviews) as total_reviews
      FROM formations
      WHERE seller_id = $1 AND is_published = TRUE`,
      [sellerId]
    );

    const stats = statsResult.rows[0];

    // Formatter les formations
    const formations = formationsResult.rows.map(f => {
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
        formationType: f.formation_type,
        visioDate: f.visio_date,
        visioDuration: f.visio_duration,
        hasTimeLimit: f.has_time_limit,
        timeLimitDate: f.time_limit_date,
        hasQuantityLimit: f.has_quantity_limit,
        quantityLimit: f.quantity_limit,
        quantitySold: f.quantity_sold,
        priceTTC: parseFloat(f.price_ttc),
        priceNet: parseFloat(f.price_net),
        totalSales: f.total_sales,
        totalRevenue: parseFloat(f.total_revenue),
        averageRating: parseFloat(f.average_rating) || 0,
        totalReviews: f.total_reviews,
        isActive: f.is_active,
        isPublished: f.is_published,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
        deletionRequested: f.deletion_requested,
        deletionRequestedAt: f.deletion_requested_at,
        deletionReason: f.deletion_reason,
      };
    });

    return res.status(200).json({
      formations,
      stats: {
        totalFormations: parseInt(stats.total_formations) || 0,
        totalStudents: parseInt(stats.total_students) || 0,
        totalRevenue: parseFloat(stats.total_revenue) || 0,
        globalRating: parseFloat(stats.global_rating) || 0,
        totalReviews: parseInt(stats.total_reviews) || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching formateur formations:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des formations',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
