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
    // Récupérer l'utilisateur avec tous les champs
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, phone, pseudo, genre, roles, avatar_url, is_active, created_at
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
        role: user.roles[0],
        avatar: user.avatar_url,
        createdAt: user.created_at,
        purchases: [], // À charger depuis une table purchases si besoin
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.code === 'XX000' || error.message?.includes('Tenant or user not found')) {
      return res.status(500).json({
        message: 'Erreur de configuration base de données : Projet Supabase en pause ou URL incorrecte. Vérifiez votre dashboard Supabase.',
        details: 'Le projet de base de données semble être inaccessible (Tenant or user not found).'
      });
    }

    return res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
}
