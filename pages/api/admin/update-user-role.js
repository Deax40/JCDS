/**
 * API Route: Update User Role
 *
 * Endpoint pour mettre à jour les rôles d'un utilisateur (Admin seulement)
 *
 * POST /api/admin/update-user-role
 * Body: { userId, roles }
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, roles } = req.body;

  // Validation
  if (!userId || !roles || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: 'userId et roles (array) sont requis' });
  }

  // Vérifier que les rôles sont valides
  const validRoles = ['acheteur', 'formateur', 'admin'];
  const invalidRoles = roles.filter(role => !validRoles.includes(role));

  if (invalidRoles.length > 0) {
    return res.status(400).json({
      message: `Rôles invalides: ${invalidRoles.join(', ')}. Rôles valides: ${validRoles.join(', ')}`
    });
  }

  try {
    // Mettre à jour les rôles de l'utilisateur
    const result = await query(
      'UPDATE users SET roles = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, roles',
      [roles, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const updatedUser = result.rows[0];

    return res.status(200).json({
      message: 'Rôles mis à jour avec succès',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        roles: updatedUser.roles,
      },
    });
  } catch (error) {
    console.error('Error updating user roles:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Utilisateur non trouvé',
      });
    }

    return res.status(500).json({
      message: 'Erreur lors de la mise à jour des rôles',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
