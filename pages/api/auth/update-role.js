/**
 * API Route: Update Role
 *
 * Permet à un utilisateur d'activer/désactiver le rôle vendeur
 *
 * POST /api/auth/update-role
 * Body: { userId, action } // action: 'add_seller' ou 'remove_seller'
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, action } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ message: 'userId et action requis' });
  }

  try {
    // Récupérer l'utilisateur actuel
    const userResult = await query(
      'SELECT id, email, roles FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userResult.rows[0];
    let newRoles = user.roles || [];

    if (action === 'add_seller') {
      // Ajouter le rôle seller s'il ne l'a pas déjà
      if (!newRoles.includes('seller')) {
        newRoles.push('seller');

        // Mettre à jour les rôles
        await query(
          'UPDATE users SET roles = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newRoles, userId]
        );

        // Créer un profil vendeur si nécessaire
        const sellerProfileExists = await query(
          'SELECT id FROM seller_profiles WHERE user_id = $1',
          [userId]
        );

        if (sellerProfileExists.rows.length === 0) {
          // Créer un profil vendeur par défaut
          await query(
            `INSERT INTO seller_profiles (user_id, display_name, bio_short)
             VALUES ($1, $2, $3)`,
            [userId, user.email.split('@')[0], 'Nouveau formateur']
          );
        }

        return res.status(200).json({
          message: 'Rôle vendeur activé avec succès',
          roles: newRoles,
        });
      } else {
        return res.status(400).json({ message: 'Vous avez déjà le rôle vendeur' });
      }
    } else if (action === 'remove_seller') {
      // Retirer le rôle seller
      newRoles = newRoles.filter(r => r !== 'seller');

      // S'assurer qu'il reste au moins buyer
      if (newRoles.length === 0) {
        newRoles = ['buyer'];
      }

      await query(
        'UPDATE users SET roles = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newRoles, userId]
      );

      return res.status(200).json({
        message: 'Rôle vendeur désactivé',
        roles: newRoles,
      });
    } else {
      return res.status(400).json({ message: 'Action invalide' });
    }
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle' });
  }
}
