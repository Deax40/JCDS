/**
 * API Route: Submit Formateur Application
 *
 * Endpoint pour soumettre une candidature formateur
 *
 * POST /api/formateur/apply
 * Body: { userId, raison, typeFormation }
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, raison, typeFormation } = req.body;

  // Validation
  if (!userId) {
    return res.status(400).json({ message: 'userId est requis' });
  }

  if (!raison || raison.length < 50) {
    return res.status(400).json({
      message: 'La raison doit contenir au moins 50 caractères'
    });
  }

  if (!typeFormation || typeFormation.length < 10) {
    return res.status(400).json({
      message: 'Le type de formation doit contenir au moins 10 caractères'
    });
  }

  try {
    // Vérifier que l'utilisateur existe
    const userCheck = await query(
      'SELECT id, roles, formateur_application_status FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userCheck.rows[0];

    // Vérifier si l'utilisateur est déjà formateur
    if (user.roles && user.roles.includes('formateur')) {
      return res.status(400).json({
        message: 'Vous êtes déjà formateur'
      });
    }

    // Vérifier si une candidature est déjà en cours
    if (user.formateur_application_status === 'pending') {
      return res.status(400).json({
        message: 'Vous avez déjà une candidature en cours de traitement'
      });
    }

    // Enregistrer la candidature
    const result = await query(
      `UPDATE users
       SET formateur_application_status = 'pending',
           formateur_application_reason = $1,
           formateur_application_formation_type = $2,
           formateur_application_date = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, first_name, last_name, formateur_application_status, formateur_application_date`,
      [raison, typeFormation, userId]
    );

    const updatedUser = result.rows[0];

    return res.status(200).json({
      success: true,
      message: 'Candidature soumise avec succès',
      application: {
        status: updatedUser.formateur_application_status,
        date: updatedUser.formateur_application_date,
      },
    });
  } catch (error) {
    console.error('Error submitting formateur application:', error);

    return res.status(500).json({
      message: 'Erreur lors de la soumission de la candidature',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
