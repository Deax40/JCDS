/**
 * API Route: Register
 *
 * Endpoint pour créer un nouveau compte utilisateur
 *
 * POST /api/auth/register
 * Body: { name, email, password, role }
 *
 * Installation requise:
 * npm install bcryptjs
 */

import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';
import { sendWelcomeEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, role = 'buyer' } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Un compte existe déjà avec cet email' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Séparer le nom en prénom et nom de famille
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Créer l'utilisateur avec le rôle buyer par défaut
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, roles)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, roles, created_at`,
      [email.toLowerCase(), passwordHash, firstName, lastName, [role]]
    );

    const user = result.rows[0];

    // Envoyer un email de bienvenue (ne pas bloquer sur erreur)
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Retourner l'utilisateur créé (sans le mot de passe)
    return res.status(201).json({
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim(),
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Messages d'erreur plus détaillés
    if (error.message?.includes('DATABASE_URL')) {
      return res.status(500).json({
        message: 'Base de données non configurée. Consultez SETUP_DATABASE.md'
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        message: 'Impossible de se connecter à la base de données. Vérifiez DATABASE_URL dans .env'
      });
    }

    if (error.code === '28P01') {
      return res.status(500).json({
        message: 'Mot de passe incorrect dans DATABASE_URL. Vérifiez votre configuration Supabase'
      });
    }

    if (error.code === '42P01') {
      return res.status(500).json({
        message: 'Table "users" non trouvée. Exécutez le fichier database/schema.sql dans Supabase'
      });
    }

    return res.status(500).json({
      message: 'Erreur lors de la création du compte',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}
