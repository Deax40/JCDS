/**
 * API Route: Create Promo Code
 *
 * Permet aux formateurs de créer des codes promo
 *
 * POST /api/promo-codes/create
 */

import { query } from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireRole(req, 'formateur');
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  const {
    code,
    discountType,
    discountValue,
    minPurchaseAmount,
    maxUses,
    validFrom,
    validUntil,
    appliesTo,
    formationIds
  } = req.body;

  // Validation
  if (!code || !discountType || !discountValue) {
    return res.status(400).json({ message: 'Code, type de réduction et valeur requis' });
  }

  if (code.length < 3 || code.length > 50) {
    return res.status(400).json({ message: 'Le code doit contenir entre 3 et 50 caractères' });
  }

  if (!['percentage', 'fixed'].includes(discountType)) {
    return res.status(400).json({ message: 'Type de réduction invalide' });
  }

  if (discountValue <= 0) {
    return res.status(400).json({ message: 'La valeur de réduction doit être positive' });
  }

  if (discountType === 'percentage' && discountValue > 100) {
    return res.status(400).json({ message: 'Le pourcentage ne peut pas dépasser 100%' });
  }

  try {
    // Vérifier que le code n'existe pas déjà
    const existing = await query(
      `SELECT id FROM promo_codes WHERE code = $1 AND formateur_id = $2`,
      [code.toUpperCase(), user.id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Ce code promo existe déjà' });
    }

    // Créer le code promo
    const result = await query(
      `INSERT INTO promo_codes (
        code,
        formateur_id,
        discount_type,
        discount_value,
        min_purchase_amount,
        max_uses,
        valid_from,
        valid_until,
        applies_to,
        formation_ids,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
      RETURNING *`,
      [
        code.toUpperCase(),
        user.id,
        discountType,
        discountValue,
        minPurchaseAmount || 0,
        maxUses || null,
        validFrom || new Date(),
        validUntil || null,
        appliesTo || 'all',
        formationIds || []
      ]
    );

    return res.status(201).json({
      message: 'Code promo créé avec succès',
      promoCode: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating promo code:', error);

    return res.status(500).json({
      message: 'Erreur lors de la création du code promo',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
