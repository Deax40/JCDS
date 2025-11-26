/**
 * API Route: Get Formateur Profile
 *
 * Récupère le profil du formateur connecté
 *
 * GET /api/formateur/profile
 */

import { query } from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  try {
    const result = await query(
      `SELECT
        id,
        first_name,
        last_name,
        pseudo,
        email,
        avatar_url,
        bio,
        competences,
        website,
        instagram,
        twitter,
        facebook,
        linkedin
      FROM users
      WHERE id = $1`,
      [session.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    return res.status(200).json({
      profile: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        pseudo: user.pseudo,
        email: user.email,
        avatar: user.avatar_url,
        bio: user.bio,
        competences: user.competences || [],
        website: user.website,
        socials: {
          instagram: user.instagram,
          twitter: user.twitter,
          facebook: user.facebook,
          linkedin: user.linkedin,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération du profil',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
