/**
 * API Route: Create Formation
 *
 * Endpoint pour créer une nouvelle formation (Formateur uniquement)
 *
 * POST /api/formateur/create-formation
 * Body: { sellerId, categorySlug, title, description, ... }
 */

import { query } from '../../../lib/db';
import { getCategoryBySlug } from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    sellerId,
    categorySlug,
    title,
    description,
    tags,
    formationType,
    visioLink,
    visioDate,
    visioDuration,
    hasTimeLimit,
    timeLimitDate,
    hasQuantityLimit,
    quantityLimit,
    priceMode,
    priceEntered,
    priceTTC,
    priceNet,
    sumupFee,
    platformFee,
  } = req.body;

  // Validation
  if (!sellerId) {
    return res.status(400).json({ message: 'sellerId est requis' });
  }

  if (!categorySlug) {
    return res.status(400).json({ message: 'Veuillez sélectionner une catégorie' });
  }

  // Vérifier que la catégorie existe
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return res.status(400).json({ message: 'Catégorie invalide' });
  }

  if (!title || title.length < 10) {
    return res.status(400).json({ message: 'Le titre doit contenir au moins 10 caractères' });
  }

  if (!description || description.length < 50) {
    return res.status(400).json({ message: 'La description doit contenir au moins 50 caractères' });
  }

  if (!formationType || !['en_ligne', 'pdf', 'visio'].includes(formationType)) {
    return res.status(400).json({ message: 'Type de formation invalide' });
  }

  if (formationType === 'visio' && !visioLink) {
    return res.status(400).json({ message: 'Le lien de visioconférence est requis' });
  }

  if (!priceTTC || priceTTC <= 0) {
    return res.status(400).json({ message: 'Prix invalide' });
  }

  try {
    // Vérifier que le vendeur existe et est formateur
    const userCheck = await query(
      'SELECT id, roles FROM users WHERE id = $1',
      [sellerId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userCheck.rows[0];
    if (!user.roles || !user.roles.includes('formateur')) {
      return res.status(403).json({ message: 'Vous devez être formateur pour créer une formation' });
    }

    // Créer la formation
    const result = await query(
      `INSERT INTO formations (
        seller_id, category_slug, title, description, tags,
        formation_type, visio_link, visio_date, visio_duration,
        has_time_limit, time_limit_date,
        has_quantity_limit, quantity_limit, quantity_sold,
        price_mode, price_entered, price_ttc, price_net, sumup_fee, platform_fee,
        is_active, is_published
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11,
        $12, $13, 0,
        $14, $15, $16, $17, $18, $19,
        TRUE, TRUE
      ) RETURNING id, title, category_slug, price_ttc, created_at`,
      [
        sellerId, categorySlug, title, description, tags || [],
        formationType, visioLink, visioDate, visioDuration,
        hasTimeLimit, timeLimitDate,
        hasQuantityLimit, quantityLimit,
        priceMode, priceEntered, priceTTC, priceNet, sumupFee, platformFee
      ]
    );

    const formation = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Formation créée avec succès',
      formation: {
        id: formation.id,
        title: formation.title,
        categorySlug: formation.category_slug,
        priceTTC: formation.price_ttc,
        createdAt: formation.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating formation:', error);

    return res.status(500).json({
      message: 'Erreur lors de la création de la formation',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
