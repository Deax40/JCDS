/**
 * API Route: Get Formation Details
 *
 * Endpoint pour récupérer les détails complets d'une formation
 *
 * GET /api/formations/[id]
 */

import { query } from '../../../lib/db';
import { getCategoryBySlug } from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID de formation requis' });
  }

  try {
    // Récupérer la formation avec les infos du vendeur
    const result = await query(
      `SELECT
        f.*,
        u.id as seller_id,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.pseudo as seller_pseudo,
        u.avatar_url as seller_avatar,
        u.bio as seller_bio,
        u.competences as seller_competences,
        u.website as seller_website,
        u.instagram as seller_instagram,
        u.twitter as seller_twitter,
        u.facebook as seller_facebook,
        u.linkedin as seller_linkedin
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      WHERE f.id = $1 AND f.is_published = TRUE`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const f = result.rows[0];
    const category = getCategoryBySlug(f.category_slug);

    // Récupérer les avis
    const reviewsResult = await query(
      `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.first_name,
        u.last_name,
        u.pseudo,
        u.avatar_url
      FROM reviews r
      JOIN users u ON r.buyer_id = u.id
      WHERE r.formation_id = $1
      ORDER BY r.created_at DESC`,
      [id]
    );

    const reviews = reviewsResult.rows.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      buyer: {
        firstName: r.first_name,
        lastName: r.last_name,
        pseudo: r.pseudo,
        avatar: r.avatar_url,
      },
    }));

    const formation = {
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
      pdfPath: f.pdf_path,
      visioLink: f.visio_link,
      visioDate: f.visio_date,
      visioDuration: f.visio_duration,
      hasTimeLimit: f.has_time_limit,
      timeLimitDate: f.time_limit_date,
      hasQuantityLimit: f.has_quantity_limit,
      quantityLimit: f.quantity_limit,
      quantitySold: f.quantity_sold,
      seller: {
        id: f.seller_id,
        firstName: f.seller_first_name,
        lastName: f.seller_last_name,
        pseudo: f.seller_pseudo,
        avatar: f.seller_avatar,
        bio: f.seller_bio,
        competences: f.seller_competences || [],
        website: f.seller_website,
        socials: {
          instagram: f.seller_instagram,
          twitter: f.seller_twitter,
          facebook: f.seller_facebook,
          linkedin: f.seller_linkedin,
        },
      },
      reviews,
    };

    return res.status(200).json({ formation });
  } catch (error) {
    console.error('Error fetching formation:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération de la formation',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
