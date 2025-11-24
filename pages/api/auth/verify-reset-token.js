/**
 * API Route: Verify Reset Token
 *
 * Vérifie si un token de réinitialisation est valide
 *
 * POST /api/auth/verify-reset-token
 * Body: { token }
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token requis' });
  }

  try {
    // Vérifier le token
    const result = await query(
      `SELECT id, user_id, expires_at, is_used
       FROM password_reset_tokens
       WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        valid: false,
        message: 'Token invalide',
      });
    }

    const resetToken = result.rows[0];

    // Vérifier si le token a déjà été utilisé
    if (resetToken.is_used) {
      return res.status(400).json({
        valid: false,
        message: 'Ce lien a déjà été utilisé',
      });
    }

    // Vérifier si le token a expiré
    const now = new Date();
    const expiresAt = new Date(resetToken.expires_at);

    if (now > expiresAt) {
      return res.status(400).json({
        valid: false,
        message: 'Ce lien a expiré',
      });
    }

    // Token valide
    return res.status(200).json({
      valid: true,
      message: 'Token valide',
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(500).json({
      valid: false,
      message: 'Erreur lors de la vérification du token',
    });
  }
}
