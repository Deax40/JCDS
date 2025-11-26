/**
 * API Route: Get Formateur Profile
 *
 * Récupère le profil du formateur connecté
 *
 * GET /api/formateur/profile
 */

import { query } from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = await getCurrentUser(req);

  if (!user) {
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
        avatar_color,
        avatar_shape,
        bio,
        competences,
        website,
        instagram,
        twitter,
        facebook,
        linkedin,
        presentation_video_url,
        show_presentation_video,
        certifications
      FROM users
      WHERE id = $1`,
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const userData = result.rows[0];

    return res.status(200).json({
      profile: {
        id: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        pseudo: userData.pseudo,
        email: userData.email,
        avatar: userData.avatar_url,
        avatarColor: userData.avatar_color || 'purple',
        avatarShape: userData.avatar_shape || 'circle',
        bio: userData.bio,
        competences: userData.competences || [],
        website: userData.website,
        presentationVideoUrl: userData.presentation_video_url,
        showPresentationVideo: userData.show_presentation_video || false,
        certifications: userData.certifications || [],
        socials: {
          instagram: userData.instagram,
          twitter: userData.twitter,
          facebook: userData.facebook,
          linkedin: userData.linkedin,
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
