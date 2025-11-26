/**
 * API Route: Upload Photo de Profil
 *
 * Permet aux formateurs de télécharger leur photo de profil
 *
 * POST /api/formateur/upload-photo
 */

import { requireRole } from '../../../lib/auth';
import { query } from '../../../lib/db';
import formidable from 'formidable';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Désactiver le body parser de Next.js pour formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let user;
  try {
    user = await requireRole(req, 'formateur');
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  try {
    // Parser le formulaire multipart
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      filter: ({ mimetype }) => mimetype && mimetype.startsWith('image/'),
    });

    const [fields, files] = await form.parse(req);
    const photo = files.photo?.[0];

    if (!photo) {
      return res.status(400).json({ message: 'Aucune photo fournie' });
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(photo.filepath);
    const fileExt = path.extname(photo.originalFilename || photo.newFilename);
    const fileName = `avatars/${user.id}-${Date.now()}${fileExt}`;

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(fileName, fileBuffer, {
        contentType: photo.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'upload' });
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Mettre à jour l'URL de l'avatar dans la base de données
    await query(
      `UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2`,
      [publicUrl, user.id]
    );

    // Nettoyer le fichier temporaire
    fs.unlinkSync(photo.filepath);

    return res.status(200).json({
      message: 'Photo uploadée avec succès',
      url: publicUrl,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);

    return res.status(500).json({
      message: 'Erreur lors de l\'upload de la photo',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
