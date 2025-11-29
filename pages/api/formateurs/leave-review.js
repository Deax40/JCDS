/**
 * API Route: Leave Review for Formateur
 *
 * Permet de laisser un avis sur le profil d'un formateur
 * Accessible uniquement aux personnes ayant acheté au moins une formation de ce formateur
 *
 * POST /api/formateurs/leave-review
 */

import { query } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireAuth(req);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  const { formateurId, formationId, rating, comment } = req.body;

  // Validation
  if (!formateurId || !formationId || !rating || !comment) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
  }

  if (comment.trim().length < 10) {
    return res.status(400).json({ message: 'Le commentaire doit contenir au moins 10 caractères' });
  }

  try {
    // Vérifier que la formation appartient bien au formateur
    const formationCheck = await query(
      `SELECT id FROM formations WHERE id = $1 AND seller_id = $2`,
      [formationId, formateurId]
    );

    if (formationCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Cette formation n\'appartient pas à ce formateur' });
    }

    // Vérifier que l'utilisateur a bien acheté une formation de ce formateur
    const purchaseCheck = await query(
      `SELECT DISTINCT p.id
       FROM purchases p
       JOIN formations f ON p.formation_id = f.id
       WHERE p.buyer_id = $1 AND f.seller_id = $2
       LIMIT 1`,
      [user.id, formateurId]
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({
        message: 'Vous devez acheter au moins une formation de ce formateur pour laisser un avis',
      });
    }

    // Vérifier si l'utilisateur n'a pas déjà laissé un avis sur cette formation
    const existingReview = await query(
      `SELECT id FROM reviews
       WHERE buyer_id = $1 AND formation_id = $2
       LIMIT 1`,
      [user.id, formationId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        message: 'Vous avez déjà laissé un avis pour cette formation',
      });
    }

    // Insérer l'avis
    await query(
      `INSERT INTO reviews (formation_id, buyer_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [formationId, user.id, rating, comment.trim()]
    );

    // Mettre à jour les statistiques de la formation
    await query(
      `UPDATE formations
       SET total_reviews = (SELECT COUNT(*) FROM reviews WHERE formation_id = $1),
           average_rating = (SELECT AVG(rating) FROM reviews WHERE formation_id = $1)
       WHERE id = $1`,
      [formationId]
    );

    return res.status(201).json({
      message: 'Avis publié avec succès',
    });
  } catch (error) {
    console.error('Error leaving review:', error);

    return res.status(500).json({
      message: 'Erreur lors de la publication de l\'avis',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
