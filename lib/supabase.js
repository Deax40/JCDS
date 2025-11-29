/**
 * Supabase Client pour le backend
 *
 * Utilise la clé service_role pour accéder à Supabase Storage
 * et gérer les fichiers PDF des formations
 *
 * IMPORTANT: Ce client ne doit JAMAIS être exposé côté frontend
 */

import { createClient } from '@supabase/supabase-js';

// Vérifier que les variables d'environnement sont définies
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL manquante dans les variables d\'environnement');
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_KEY manquante dans les variables d\'environnement');
}

// Créer le client Supabase avec la clé service_role
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Nom du bucket (peut être configuré via env)
export const FORMATIONS_BUCKET = process.env.SUPABASE_BUCKET || 'formations';

/**
 * Upload un fichier PDF dans Supabase Storage
 *
 * @param {Buffer} fileBuffer - Le contenu du fichier
 * @param {string} filePath - Le chemin dans le bucket (ex: formations/123/mon-cours.pdf)
 * @param {string} contentType - Type MIME du fichier
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
export async function uploadPDF(fileBuffer, filePath, contentType = 'application/pdf') {
  try {
    const { data, error } = await supabase.storage
      .from(FORMATIONS_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false, // Ne pas écraser si existe déjà
      });

    if (error) {
      console.error('Erreur upload Supabase Storage:', error);
      return { success: false, error: error.message };
    }

    return { success: true, path: data.path };
  } catch (error) {
    console.error('Erreur upload PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Génère une URL signée temporaire pour accéder à un fichier privé
 *
 * @param {string} filePath - Le chemin du fichier dans le bucket
 * @param {number} expiresIn - Durée de validité en secondes (défaut: 1h)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function getSignedUrl(filePath, expiresIn = 3600) {
  try {
    const { data, error } = await supabase.storage
      .from(FORMATIONS_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Erreur génération signed URL:', error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error('Erreur getSignedUrl:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprime un fichier PDF du Storage
 *
 * @param {string} filePath - Le chemin du fichier à supprimer
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deletePDF(filePath) {
  try {
    const { error } = await supabase.storage
      .from(FORMATIONS_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Erreur suppression PDF:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur deletePDF:', error);
    return { success: false, error: error.message };
  }
}
