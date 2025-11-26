/**
 * API Route: Login
 *
 * Endpoint pour se connecter
 *
 * POST /api/auth/login
 * Body: { email, password }
 */

import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // Récupérer l'utilisateur avec tous les champs y compris le statut de candidature
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, phone, pseudo, genre, roles, avatar_url, is_active, created_at,
              formateur_application_status, formateur_application_date
       FROM users
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(403).json({ message: 'Votre compte a été désactivé' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Définir le cookie de session
    res.setHeader('Set-Cookie', `userId=${user.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`); // 7 jours

    // Retourner les données complètes de l'utilisateur
    return res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        nom: user.last_name,
        prenom: user.first_name,
        pseudo: user.pseudo,
        telephone: user.phone,
        genre: user.genre,
        role: user.roles ? user.roles[0] : 'acheteur',
        roles: user.roles || ['acheteur'],
        avatar: user.avatar_url,
        createdAt: user.created_at,
        formateurApplicationStatus: user.formateur_application_status,
        formateurApplicationDate: user.formateur_application_date,
        purchases: [], // À charger depuis une table purchases si besoin
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
}
