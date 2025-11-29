/**
 * API Route: Request Formation Deletion
 *
 * Permet au formateur de demander la suppression d'une formation
 * La formation est retirée de la vente mais reste visible pour les admins
 *
 * POST /api/formateur/request-deletion
 * Body: { formationId, reason }
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Récupérer l'utilisateur depuis les cookies
  const cookies = cookie.parse(req.headers.cookie || '');
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  const { formationId, reason } = req.body;

  if (!formationId) {
    return res.status(400).json({ message: 'Formation ID requis' });
  }

  try {
    // Vérifier que la formation appartient au formateur
    const formationCheck = await query(
      'SELECT id, seller_id, title, is_active FROM formations WHERE id = $1',
      [formationId]
    );

    if (formationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const formation = formationCheck.rows[0];

    if (formation.seller_id !== user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette formation' });
    }

    // Vérifier si une demande est déjà en attente
    const existingRequest = await query(
      'SELECT id FROM formation_deletion_requests WHERE formation_id = $1 AND status = $2',
      [formationId, 'pending']
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ message: 'Une demande de suppression est déjà en attente pour cette formation' });
    }

    // Retirer la formation de la vente (is_active = FALSE)
    await query(
      `UPDATE formations
       SET is_active = FALSE,
           deletion_requested = TRUE,
           deletion_requested_at = NOW(),
           deletion_reason = $1
       WHERE id = $2`,
      [reason || 'Aucune raison fournie', formationId]
    );

    // Créer la demande de suppression
    await query(
      `INSERT INTO formation_deletion_requests
       (formation_id, requester_id, reason, status, requested_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [formationId, user.id, reason || 'Aucune raison fournie', 'pending']
    );

    return res.status(200).json({
      success: true,
      message: 'Demande de suppression envoyée. Votre formation a été retirée de la vente en attendant l\'approbation d\'un administrateur.',
    });
  } catch (error) {
    console.error('Error requesting deletion:', error);
    return res.status(500).json({
      message: 'Erreur lors de la demande de suppression',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
