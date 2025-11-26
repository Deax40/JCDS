/**
 * Authentication Helper
 *
 * Gère l'authentification basée sur les cookies de session
 */

import { query } from './db';

/**
 * Récupère l'utilisateur connecté depuis les cookies
 */
export async function getCurrentUser(req) {
  try {
    // Récupérer l'ID utilisateur depuis le cookie
    const cookies = req.headers.cookie || '';
    const userIdMatch = cookies.match(/userId=([^;]+)/);

    if (!userIdMatch) {
      return null;
    }

    const userId = userIdMatch[1];

    // Récupérer l'utilisateur depuis la base de données
    const result = await query(
      `SELECT
        id,
        email,
        first_name,
        last_name,
        pseudo,
        avatar_url,
        avatar_color,
        avatar_shape,
        roles
      FROM users
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function requireAuth(req) {
  const user = await getCurrentUser(req);

  if (!user) {
    throw new Error('Non authentifié');
  }

  return user;
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function requireRole(req, role) {
  const user = await requireAuth(req);

  if (!user.roles || !user.roles.includes(role)) {
    throw new Error('Accès non autorisé');
  }

  return user;
}
