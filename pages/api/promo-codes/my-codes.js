/**
 * API Route: Get My Promo Codes
 *
 * Récupère tous les codes promo d'un formateur
 *
 * GET /api/promo-codes/my-codes
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
      `SELECT * FROM promo_codes
       WHERE formateur_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    const promoCodes = result.rows.map(code => ({
      id: code.id,
      code: code.code,
      discountType: code.discount_type,
      discountValue: parseFloat(code.discount_value),
      minPurchaseAmount: parseFloat(code.min_purchase_amount),
      maxUses: code.max_uses,
      currentUses: code.current_uses,
      validFrom: code.valid_from,
      validUntil: code.valid_until,
      isActive: code.is_active,
      appliesTo: code.applies_to,
      formationIds: code.formation_ids || [],
      createdAt: code.created_at,
    }));

    return res.status(200).json({ promoCodes });
  } catch (error) {
    console.error('Error fetching promo codes:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des codes promo',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
