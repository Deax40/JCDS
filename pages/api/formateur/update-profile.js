/**
 * API Route: Update Formateur Profile
 *
 * Permet aux formateurs de mettre à jour leur profil public
 *
 * PUT /api/formateur/update-profile
 */

import { query } from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  // Vérifier que l'utilisateur est formateur
  const userCheck = await query(
    `SELECT roles FROM users WHERE id = $1`,
    [session.user.id]
  );

  if (userCheck.rows.length === 0 || !userCheck.rows[0].roles.includes('formateur')) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }

  const {
    bio,
    competences,
    website,
    instagram,
    twitter,
    facebook,
    linkedin
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

  try {
    await query(
      `UPDATE users
       SET bio = $1,
           competences = $2,
           website = $3,
           instagram = $4,
           twitter = $5,
           facebook = $6,
           linkedin = $7,
           updated_at = NOW()
       WHERE id = $8`,
      [
        bio?.trim() || null,
        competences || [],
        website?.trim() || null,
        instagram?.trim() || null,
        twitter?.trim() || null,
        facebook?.trim() || null,
        linkedin?.trim() || null,
        session.user.id
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
