/**
 * API Route: Edit User (Admin Only)
 *
 * Permet à l'admin de modifier les informations d'un utilisateur
 *
 * POST /api/admin/edit-user
 * Body: { userId, prenom, nom, pseudo, email, telephone, genre }
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const { userId, prenom, nom, pseudo, email, telephone, genre } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID requis' });
  }

  try {
    // Vérifier que l'utilisateur existe
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Construire la requête de mise à jour dynamiquement
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (prenom !== undefined) {
      updates.push(`prenom = $${paramCount++}`);
      values.push(prenom);
    }

    if (nom !== undefined) {
      updates.push(`nom = $${paramCount++}`);
      values.push(nom);
    }

    if (pseudo !== undefined) {
      // Vérifier que le pseudo n'est pas déjà pris par un autre utilisateur
      const pseudoCheck = await query(
        'SELECT id FROM users WHERE pseudo = $1 AND id != $2',
        [pseudo, userId]
      );

      if (pseudoCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Ce pseudo est déjà utilisé' });
      }

      updates.push(`pseudo = $${paramCount++}`);
      values.push(pseudo);
    }

    if (email !== undefined) {
      // Vérifier que l'email n'est pas déjà pris
      const emailCheck = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (telephone !== undefined) {
      updates.push(`telephone = $${paramCount++}`);
      values.push(telephone);
    }

    if (genre !== undefined) {
      updates.push(`genre = $${paramCount++}`);
      values.push(genre);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Aucune modification fournie' });
    }

    // Mettre à jour l'utilisateur
    values.push(userId);
    const updateQuery = `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, prenom, nom, pseudo, email, telephone, genre, roles
    `;

    const result = await query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
