/**
 * API Route: Download PDF with Signed URL
 *
 * Endpoint pour télécharger un PDF via une URL signée Supabase
 * Vérifie que l'utilisateur a bien acheté la formation avant d'autoriser le téléchargement
 *
 * GET /api/purchases/download-pdf?userId=123&formationId=456
 */

import { query } from '../../../lib/db';
import { getSignedUrl } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, formationId } = req.query;

  if (!userId || !formationId) {
    return res.status(400).json({ message: 'userId et formationId sont requis' });
  }

  try {
    // Vérifier que l'utilisateur a bien acheté cette formation
    const purchaseCheck = await query(
      `SELECT p.id, f.pdf_path, f.title
       FROM purchases p
       JOIN formations f ON p.formation_id = f.id
       WHERE p.buyer_id = $1 AND p.formation_id = $2
       LIMIT 1`,
      [userId, formationId]
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({
        message: 'Vous n\'avez pas accès à cette formation',
      });
    }

    const purchase = purchaseCheck.rows[0];

    if (!purchase.pdf_path) {
      return res.status(404).json({
        message: 'Aucun PDF disponible pour cette formation',
      });
    }

    // Générer une URL signée (valide 1 heure)
    const signedUrlResult = await getSignedUrl(purchase.pdf_path, 3600);

    if (!signedUrlResult.success) {
      console.error('Erreur génération signed URL:', signedUrlResult.error);
      return res.status(500).json({
        message: 'Erreur lors de la génération du lien de téléchargement',
        details: process.env.NODE_ENV !== 'production' ? signedUrlResult.error : undefined,
      });
    }

    return res.status(200).json({
      success: true,
      url: signedUrlResult.url,
      title: purchase.title,
      expiresIn: 3600, // secondes
    });
  } catch (error) {
    console.error('Error generating PDF download URL:', error);

    // Si la table purchases n'existe pas encore
    if (error.code === '42P01') {
      return res.status(403).json({
        message: 'Système d\'achats non initialisé',
      });
    }

    return res.status(500).json({
      message: 'Erreur lors de la génération du lien de téléchargement',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
