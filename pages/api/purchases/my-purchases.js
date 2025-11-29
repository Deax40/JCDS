/**
 * API Route: Get User Purchases
 *
 * Endpoint pour récupérer tous les achats d'un utilisateur
 *
 * GET /api/purchases/my-purchases?userId=123
 */

import { query } from '../../../lib/db';
import { getCategoryBySlug } from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId est requis' });
  }

  try {
    // Récupérer tous les achats de l'utilisateur avec les détails des formations
    const purchasesResult = await query(
      `SELECT
        p.id as purchase_id,
        p.price_paid,
        p.payment_method,
        p.payment_id,
        p.payment_status,
        p.purchased_at,
        f.id as formation_id,
        f.title as formation_title,
        f.category_slug,
        f.formation_type,
        f.pdf_path,
        f.visio_link,
        f.visio_date,
        f.price_ttc,
        f.price_net,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.pseudo as seller_pseudo
      FROM purchases p
      JOIN formations f ON p.formation_id = f.id
      JOIN users u ON f.seller_id = u.id
      WHERE p.buyer_id = $1
      ORDER BY p.purchased_at DESC`,
      [userId]
    );

    const purchases = purchasesResult.rows.map(p => {
      const category = getCategoryBySlug(p.category_slug);

      return {
        id: p.purchase_id,
        purchasedAt: p.purchased_at,
        pricePaid: parseFloat(p.price_paid),
        paymentMethod: p.payment_method,
        paymentId: p.payment_id,
        paymentStatus: p.payment_status,
        formation: {
          id: p.formation_id,
          title: p.formation_title,
          type: p.formation_type,
          pdfPath: p.pdf_path,
          visioLink: p.visio_link,
          visioDate: p.visio_date,
          priceTTC: parseFloat(p.price_ttc),
          priceNet: parseFloat(p.price_net),
          category: {
            slug: p.category_slug,
            name: category?.name || p.category_slug,
            gradient: category?.gradient || 'from-gray-500 to-gray-700',
            icon: category?.icon || 'ph-book',
          },
          seller: {
            firstName: p.seller_first_name,
            lastName: p.seller_last_name,
            pseudo: p.seller_pseudo,
          },
        },
      };
    });

    return res.status(200).json({ purchases });
  } catch (error) {
    console.error('Error fetching user purchases:', error);

    // Si la table purchases n'existe pas encore, retourner un tableau vide
    if (error.code === '42P01') {
      return res.status(200).json({ purchases: [] });
    }

    return res.status(500).json({
      message: 'Erreur lors de la récupération des achats',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
