/**
 * API Route: Delete User (Admin Only)
 *
 * Permet à l'admin de supprimer un utilisateur
 * ATTENTION: Suppression définitive avec CASCADE
 *
 * DELETE /api/admin/delete-user
 * Body: { userId }
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Vérifier que l'utilisateur est admin
  const cookies = cookie.parse(req.headers.cookie || '');
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  let admin;
  try {
    admin = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  if (!admin.roles || !admin.roles.includes('admin')) {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID requis' });
  }

  // Empêcher l'admin de se supprimer lui-même
  if (userId === admin.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
  }

  try {
    // Vérifier que l'utilisateur existe
    const userCheck = await query(
      'SELECT id, prenom, nom, pseudo, roles FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userCheck.rows[0];

    // Empêcher de supprimer un autre admin (sécurité)
    if (user.roles && user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Impossible de supprimer un administrateur' });
    }

    // Supprimer l'utilisateur (CASCADE supprimera automatiquement ses formations, achats, etc.)
    await query('DELETE FROM users WHERE id = $1', [userId]);

    return res.status(200).json({
      success: true,
      message: `Utilisateur ${user.prenom} ${user.nom} (${user.pseudo}) supprimé avec succès`,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      message: 'Erreur lors de la suppression',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
