/**
 * API Route: Update Application Status
 *
 * Endpoint pour mettre à jour le statut d'une candidature formateur (Admin seulement)
 *
 * POST /api/admin/update-application-status
 * Body: { userId, status }
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, status } = req.body;

  // Validation
  if (!userId || !status) {
    return res.status(400).json({ message: 'userId et status sont requis' });
  }

  // Vérifier que le statut est valide
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Statut invalide. Statuts valides: ${validStatuses.join(', ')}`
    });
  }

  try {
    // Mettre à jour le statut de candidature
    const result = await query(
      'UPDATE users SET formateur_application_status = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, formateur_application_status',
      [status, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const updatedUser = result.rows[0];

    return res.status(200).json({
      message: 'Statut de candidature mis à jour avec succès',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        formateurApplicationStatus: updatedUser.formateur_application_status,
      },
    });
  } catch (error) {
    console.error('Error updating application status:', error);

    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
