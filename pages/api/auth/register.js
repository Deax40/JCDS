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

  const { email, telephone, nom, prenom, pseudo, password, genre, role = 'acheteur' } = req.body;

  // Validation
  if (!email || !telephone || !nom || !prenom || !pseudo || !password || !genre) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (!/^[0-9]{10}$/.test(telephone.replace(/\s/g, ''))) {
    return res.status(400).json({ message: 'Le téléphone doit contenir 10 chiffres' });
  }

  if (pseudo.length < 3 || !/^[a-zA-Z0-9_]+$/.test(pseudo)) {
    return res.status(400).json({ message: 'Le pseudo doit contenir au moins 3 caractères (lettres, chiffres et underscores uniquement)' });
  }

  if (!['homme', 'femme'].includes(genre)) {
    return res.status(400).json({ message: 'Genre invalide' });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingEmail = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ message: 'Un compte existe déjà avec cet email' });
    }

    // Vérifier si le téléphone existe déjà
    const existingPhone = await query(
      'SELECT id FROM users WHERE phone = $1',
      [telephone.replace(/\s/g, '')]
    );

    if (existingPhone.rows.length > 0) {
      return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé' });
    }

    // Vérifier si le pseudo existe déjà
    const existingPseudo = await query(
      'SELECT id FROM users WHERE pseudo = $1',
      [pseudo]
    );

    if (existingPseudo.rows.length > 0) {
      return res.status(400).json({ message: 'Ce pseudo est déjà utilisé' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Avatar basé sur le genre
    const avatarUrl = genre === 'femme' ? '/assets/avatars/femme.png' : '/assets/avatars/homme.png';

    // Créer l'utilisateur avec le rôle acheteur par défaut
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, pseudo, genre, roles, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, first_name, last_name, phone, pseudo, genre, roles, avatar_url, created_at`,
      [email.toLowerCase(), passwordHash, prenom, nom, telephone.replace(/\s/g, ''), pseudo, genre, [role], avatarUrl]
    );

    const user = result.rows[0];

    // Envoyer un email de bienvenue (ne pas bloquer sur erreur)
    try {
      await sendWelcomeEmail(email, `${prenom} ${nom}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Retourner l'utilisateur créé (sans le mot de passe)
    return res.status(201).json({
      message: 'Compte créé avec succès',
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

    if (error.code === 'XX000' || error.message?.includes('Tenant or user not found')) {
      return res.status(500).json({
        message: 'Erreur de configuration base de données : Projet Supabase en pause ou URL incorrecte. Vérifiez votre dashboard Supabase.',
        details: 'Le projet de base de données semble être inaccessible (Tenant or user not found).'
      });
    }

    return res.status(500).json({
      message: 'Erreur lors de la création du compte',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}
