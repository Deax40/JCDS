/**
 * API Route: Create Bundle
 *
 * Permet aux formateurs de créer des packs/bundles de formations
 *
 * POST /api/bundles/create
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
    title,
    description,
    formationIds,
    discountPercentage
  } = req.body;

  // Validation
  if (!title || !formationIds || formationIds.length < 2) {
    return res.status(400).json({ message: 'Titre et au moins 2 formations requis' });
  }

  if (!discountPercentage || discountPercentage <= 0 || discountPercentage >= 100) {
    return res.status(400).json({ message: 'Pourcentage de réduction invalide (1-99%)' });
  }

  try {
    // Vérifier que toutes les formations appartiennent au formateur
    const formationsCheck = await query(
      `SELECT id, price_ttc FROM formations
       WHERE id = ANY($1) AND seller_id = $2 AND is_published = TRUE`,
      [formationIds, user.id]
    );

    if (formationsCheck.rows.length !== formationIds.length) {
      return res.status(400).json({
        message: 'Certaines formations sont invalides ou ne vous appartiennent pas'
      });
    }

    // Calculer le prix total original
    const originalPrice = formationsCheck.rows.reduce(
      (sum, f) => sum + parseFloat(f.price_ttc),
      0
    );

    // Calculer le prix du bundle avec réduction
    const bundlePrice = originalPrice * (1 - discountPercentage / 100);

    // Créer le bundle
    const result = await query(
      `INSERT INTO bundles (
        formateur_id,
        title,
        description,
        formation_ids,
        original_price,
        bundle_price,
        discount_percentage,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *`,
      [
        user.id,
        title,
        description || '',
        formationIds,
        originalPrice,
        bundlePrice,
        discountPercentage
      ]
    );

    return res.status(201).json({
      message: 'Bundle créé avec succès',
      bundle: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        formationIds: result.rows[0].formation_ids,
        originalPrice: parseFloat(result.rows[0].original_price),
        bundlePrice: parseFloat(result.rows[0].bundle_price),
        discountPercentage: parseFloat(result.rows[0].discount_percentage),
        savings: originalPrice - bundlePrice,
      }
    });
  } catch (error) {
    console.error('Error creating bundle:', error);

    return res.status(500).json({
      message: 'Erreur lors de la création du bundle',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
