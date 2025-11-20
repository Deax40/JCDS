/**
 * API Route: Forgot Password
 *
 * Génère un token de réinitialisation et envoie un email
 *
 * POST /api/auth/forgot-password
 * Body: { email }
 */

import crypto from 'crypto';
import { query } from '../../../lib/db';
import { sendPasswordResetEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email requis' });
  }

  try {
    // Vérifier si l'utilisateur existe
    const userResult = await query(
      'SELECT id, first_name, last_name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Toujours retourner succès pour ne pas révéler si le compte existe
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
      });
    }

    const user = userResult.rows[0];
    const userName = `${user.first_name} ${user.last_name}`.trim();

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Date d'expiration : 1 heure
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    // Enregistrer le token en base
    await query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // Envoyer l'email
    await sendPasswordResetEmail(email, resetToken, userName);

    return res.status(200).json({
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
  }
}
