/**
 * API Route: Update Formateur Profile
 *
 * Permet aux formateurs de mettre à jour leur profil public
 *
 * PUT /api/formateur/update-profile
 */

import { query } from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    // Vérifier que l'utilisateur est authentifié et formateur
    user = await requireRole(req, 'formateur');
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  const {
    firstName,
    lastName,
    avatarColor,
    avatarShape,
    avatarUrl,
    bio,
    competences,
    website,
    instagram,
    twitter,
    facebook,
    linkedin,
    presentationVideoUrl,
    showPresentationVideo,
    certifications
  } = req.body;

  // Validation
  if (bio && bio.length > 1000) {
    return res.status(400).json({ message: 'La bio ne peut pas dépasser 1000 caractères' });
  }

  if (competences && (!Array.isArray(competences) || competences.length > 20)) {
    return res.status(400).json({ message: 'Maximum 20 compétences autorisées' });
  }

  // Valider les URLs si fournies
  const urlFields = { website, instagram, twitter, facebook, linkedin };
  for (const [field, value] of Object.entries(urlFields)) {
    if (value && value.trim()) {
      try {
        new URL(value);
      } catch (e) {
        return res.status(400).json({ message: `Le lien ${field} n'est pas valide` });
      }
    }
  }

  // Validation du nom et prénom
  if (firstName && (firstName.length < 2 || firstName.length > 50)) {
    return res.status(400).json({ message: 'Le prénom doit contenir entre 2 et 50 caractères' });
  }

  if (lastName && (lastName.length < 2 || lastName.length > 50)) {
    return res.status(400).json({ message: 'Le nom doit contenir entre 2 et 50 caractères' });
  }

  // Validation avatar color
  const validColors = ['purple', 'blue', 'green', 'red', 'orange', 'pink', 'yellow', 'indigo', 'teal'];
  if (avatarColor && !validColors.includes(avatarColor)) {
    return res.status(400).json({ message: 'Couleur d\'avatar non valide' });
  }

  // Validation avatar shape
  const validShapes = ['circle', 'square'];
  if (avatarShape && !validShapes.includes(avatarShape)) {
    return res.status(400).json({ message: 'Forme d\'avatar non valide' });
  }

  // Validation vidéo YouTube
  if (presentationVideoUrl && presentationVideoUrl.trim()) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(presentationVideoUrl)) {
      return res.status(400).json({ message: 'URL YouTube non valide' });
    }
  }

  // Validation certifications
  if (certifications && !Array.isArray(certifications)) {
    return res.status(400).json({ message: 'Le format des certifications est invalide' });
  }

  try {
    await query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           avatar_url = COALESCE($3, avatar_url),
           avatar_color = COALESCE($4, avatar_color),
           avatar_shape = COALESCE($5, avatar_shape),
           bio = $6,
           competences = $7,
           website = $8,
           instagram = $9,
           twitter = $10,
           facebook = $11,
           linkedin = $12,
           presentation_video_url = $13,
           show_presentation_video = $14,
           certifications = $15,
           updated_at = NOW()
       WHERE id = $16`,
      [
        firstName?.trim() || null,
        lastName?.trim() || null,
        avatarUrl?.trim() || null,
        avatarColor || null,
        avatarShape || null,
        bio?.trim() || null,
        competences || [],
        website?.trim() || null,
        instagram?.trim() || null,
        twitter?.trim() || null,
        facebook?.trim() || null,
        linkedin?.trim() || null,
        presentationVideoUrl?.trim() || null,
        showPresentationVideo || false,
        JSON.stringify(certifications || []),
        user.id
      ]
    );

    return res.status(200).json({
      message: 'Profil mis à jour avec succès',
    });
  } catch (error) {
    console.error('Error updating profile:', error);

    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du profil',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
