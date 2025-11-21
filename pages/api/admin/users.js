/**
 * API Route: Admin - Get All Users
 *
 * Endpoint pour récupérer tous les utilisateurs (admin uniquement)
 *
 * GET /api/admin/users
 * GET /api/admin/users?search=100001 (recherche par ID)
 */

import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // TODO: Vérifier l'authentification admin ici
  // Pour l'instant, on autorise l'accès

  try {
    const { search } = req.query;

    let sqlQuery = `
      SELECT
        id, email, first_name, last_name, phone, pseudo, genre, roles,
        avatar_url, is_active, created_at
      FROM users
    `;

    const params = [];

    // Si recherche par ID
    if (search) {
      sqlQuery += ` WHERE id::text LIKE $1`;
      params.push(`%${search}%`);
    }

    sqlQuery += ` ORDER BY created_at DESC`;

    const result = await query(sqlQuery, params);

    // Formater les utilisateurs pour l'interface admin
    const users = result.rows.map(user => ({
      id: user.id,
      email: user.email,
      nom: user.last_name,
      prenom: user.first_name,
      pseudo: user.pseudo,
      telephone: user.phone,
      genre: user.genre,
      role: user.roles[0],
      avatar: user.avatar_url,
      isActive: user.is_active,
      createdAt: user.created_at,
    }));

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des utilisateurs',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}
