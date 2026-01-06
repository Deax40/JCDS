/**
 * API Route: Update Pseudo
 *
 * Endpoint pour mettre à jour le pseudo d'un utilisateur
 *
 * POST /api/auth/update-pseudo
 * Body: { userId, newPseudo }
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, newPseudo } = req.body;

  // Validation
  if (!userId || !newPseudo) {
    return res.status(400).json({ message: 'User ID et nouveau pseudo requis' });
  }

  if (newPseudo.length < 3 || !/^[a-zA-Z0-9_]+$/.test(newPseudo)) {
    return res.status(400).json({
      message: 'Le pseudo doit contenir au moins 3 caractères (lettres, chiffres et underscores uniquement)'
    });
  }

  try {
    // Vérifier si le pseudo est déjà utilisé par un autre utilisateur
    const existingPseudo = await query(
      'SELECT id FROM users WHERE pseudo = $1 AND id != $2',
      [newPseudo, userId]
    );

    if (existingPseudo.rows.length > 0) {
      return res.status(400).json({ message: 'Ce pseudo est déjà utilisé' });
    }

    // Mettre à jour le pseudo
    const result = await query(
      `UPDATE users
       SET pseudo = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, first_name, last_name, phone, pseudo, genre, roles, avatar_url, created_at`,
      [newPseudo, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    // Retourner l'utilisateur mis à jour
    return res.status(200).json({
      message: 'Pseudo mis à jour avec succès',
      user: {
        id: user.id,
        email: user.email,
        nom: user.last_name,
        prenom: user.first_name,
        pseudo: user.pseudo,
        telephone: user.phone,
        genre: user.genre,
        role: user.roles[0],
        avatar: user.avatar_url,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Update pseudo error:', error);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du pseudo',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}
