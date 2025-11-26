/**
 * API Route: Get My Bundles
 *
 * Récupère tous les bundles d'un formateur
 *
 * GET /api/bundles/my-bundles
 */

import { query } from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireRole(req, 'formateur');
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  try {
    const result = await query(
      `SELECT
        b.*,
        COUNT(DISTINCT bp.id) as total_sales
       FROM bundles b
       LEFT JOIN bundle_purchases bp ON b.id = bp.bundle_id
       WHERE b.formateur_id = $1
       GROUP BY b.id
       ORDER BY b.created_at DESC`,
      [user.id]
    );

    const bundles = await Promise.all(result.rows.map(async (bundle) => {
      // Récupérer les formations du bundle
      const formations = await query(
        `SELECT id, title, price_ttc FROM formations
         WHERE id = ANY($1)`,
        [bundle.formation_ids]
      );

      return {
        id: bundle.id,
        title: bundle.title,
        description: bundle.description,
        formations: formations.rows.map(f => ({
          id: f.id,
          title: f.title,
          price: parseFloat(f.price_ttc)
        })),
        originalPrice: parseFloat(bundle.original_price),
        bundlePrice: parseFloat(bundle.bundle_price),
        discountPercentage: parseFloat(bundle.discount_percentage),
        savings: parseFloat(bundle.original_price) - parseFloat(bundle.bundle_price),
        totalSales: parseInt(bundle.total_sales) || 0,
        isActive: bundle.is_active,
        createdAt: bundle.created_at,
      };
    }));

    return res.status(200).json({ bundles });
  } catch (error) {
    console.error('Error fetching bundles:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des bundles',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
