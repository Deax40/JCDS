/**
 * API Route: Get Formateur Profile Detail
 *
 * Récupère le profil complet d'un formateur avec ses formations et avis
 *
 * GET /api/formateurs/[id]
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID formateur requis' });
  }

  try {
    // Récupérer le profil complet du formateur
    const formateurResult = await query(
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
        u.competences,
        u.website,
        u.instagram,
        u.twitter,
        u.facebook,
        u.linkedin,
        u.presentation_video_url,
        u.show_presentation_video,
        u.certifications,
        u.created_at
      FROM users u
      WHERE u.id = $1 AND 'formateur' = ANY(u.roles)`,
      [id]
    );

    if (formateurResult.rows.length === 0) {
      return res.status(404).json({ message: 'Formateur non trouvé' });
    }

    const formateur = formateurResult.rows[0];

    // Récupérer les formations du formateur
    const formationsResult = await query(
      `SELECT
        id,
        title,
        description,
        category_slug,
        price_ttc,
        price_net,
        formation_type,
        average_rating,
        total_sales,
        total_reviews,
        created_at
      FROM formations
      WHERE seller_id = $1 AND is_published = TRUE
      ORDER BY created_at DESC`,
      [id]
    );

    // Récupérer tous les avis des formations du formateur
    const reviewsResult = await query(
      `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.formation_id,
        f.title as formation_title,
        u.first_name,
        u.last_name,
        u.pseudo,
        u.avatar_url,
        u.avatar_color,
        u.avatar_shape
      FROM reviews r
      JOIN formations f ON r.formation_id = f.id
      JOIN users u ON r.buyer_id = u.id
      WHERE f.seller_id = $1
      ORDER BY r.created_at DESC
      LIMIT 50`,
      [id]
    );

    // Calculer les statistiques
    const stats = {
      totalFormations: formationsResult.rows.length,
      totalStudents: formationsResult.rows.reduce((sum, f) => sum + (f.total_sales || 0), 0),
      globalRating: formationsResult.rows.length > 0
        ? formationsResult.rows.reduce((sum, f) => sum + (parseFloat(f.average_rating) || 0), 0) / formationsResult.rows.length
        : 0,
      totalReviews: reviewsResult.rows.length,
    };

    return res.status(200).json({
      formateur: {
        id: formateur.id,
        firstName: formateur.first_name,
        lastName: formateur.last_name,
        pseudo: formateur.pseudo,
        avatar: formateur.avatar_url,
        avatarColor: formateur.avatar_color || 'purple',
        avatarShape: formateur.avatar_shape || 'circle',
        bio: formateur.bio,
        competences: formateur.competences || [],
        website: formateur.website,
        presentationVideoUrl: formateur.presentation_video_url,
        showPresentationVideo: formateur.show_presentation_video,
        certifications: formateur.certifications || [],
        socials: {
          instagram: formateur.instagram,
          twitter: formateur.twitter,
          facebook: formateur.facebook,
          linkedin: formateur.linkedin,
        },
        memberSince: formateur.created_at,
        stats,
      },
      formations: formationsResult.rows.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        categorySlug: f.category_slug,
        priceTTC: parseFloat(f.price_ttc),
        priceNet: parseFloat(f.price_net),
        type: f.formation_type,
        averageRating: parseFloat(f.average_rating) || 0,
        totalSales: f.total_sales,
        totalReviews: f.total_reviews,
        createdAt: f.created_at,
      })),
      reviews: reviewsResult.rows.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
        formationId: r.formation_id,
        formationTitle: r.formation_title,
        buyer: {
          firstName: r.first_name,
          lastName: r.last_name,
          pseudo: r.pseudo,
          avatar: r.avatar_url,
          avatarColor: r.avatar_color,
          avatarShape: r.avatar_shape,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching formateur profile:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération du profil',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
