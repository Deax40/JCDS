/**
 * API Route: Reset Password
 *
 * Réinitialise le mot de passe avec un token valide
 *
 * POST /api/auth/reset-password
 * Body: { token, password }
 */

import bcrypt from 'bcryptjs';
import { query, getClient } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token et mot de passe requis' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Vérifier et récupérer le token
    const tokenResult = await client.query(
      `SELECT id, user_id, expires_at, is_used
       FROM password_reset_tokens
       WHERE token = $1`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Token invalide' });
    }

    const resetToken = tokenResult.rows[0];

    if (resetToken.is_used) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Ce lien a déjà été utilisé' });
    }

    if (new Date() > new Date(resetToken.expires_at)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Ce lien a expiré' });
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe
    await client.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, resetToken.user_id]
    );

    // Marquer le token comme utilisé
    await client.query(
      'UPDATE password_reset_tokens SET is_used = TRUE WHERE id = $1',
      [resetToken.id]
    );

    // Invalider tous les autres tokens de cet utilisateur
    await client.query(
      'UPDATE password_reset_tokens SET is_used = TRUE WHERE user_id = $1 AND id != $2',
      [resetToken.user_id, resetToken.id]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      message: 'Mot de passe réinitialisé avec succès',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
  } finally {
    client.release();
  }
}
