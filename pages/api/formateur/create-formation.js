/**
 * API Route: Create Formation
 *
 * Endpoint pour créer une nouvelle formation (Formateur uniquement)
 *
 * POST /api/formateur/create-formation
 * Body: { sellerId, categorySlug, title, description, ... }
 * Pour PDF: multipart/form-data avec fichier PDF + données JSON
 */

import { query } from '../../../lib/db';
import { getCategoryBySlug } from '../../../data/categories';
import { uploadPDF } from '../../../lib/supabase';
import formidable from 'formidable';
import fs from 'fs';

// Désactiver le body parser de Next.js pour gérer multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper pour parser JSON body
async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Helper pour parser multipart/form-data
async function parseForm(req) {
  const form = formidable({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: ({ mimetype }) => mimetype === 'application/pdf',
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let bodyData;
  let pdfFile = null;
  let pdfFilePath = null;

  // Déterminer si c'est un upload PDF ou JSON simple
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('multipart/form-data')) {
    // Parser le multipart/form-data (PDF upload)
    try {
      const { fields, files } = await parseForm(req);
      bodyData = JSON.parse(fields.data[0]);

      if (files.pdf && files.pdf[0]) {
        pdfFile = files.pdf[0];
        pdfFilePath = pdfFile.filepath;
      }
    } catch (error) {
      console.error('Error parsing multipart form:', error);
      return res.status(400).json({ message: 'Erreur lors du parsing du formulaire' });
    }
  } else {
    // Parser le JSON standard
    try {
      bodyData = await parseJsonBody(req);
    } catch (error) {
      console.error('Error parsing JSON body:', error);
      return res.status(400).json({ message: 'Erreur lors du parsing du JSON' });
    }
  }

  const {
    sellerId,
    categorySlug,
    title,
    description,
    tags,
    formationType,
    visioLink,
    visioDate,
    visioDuration,
    hasTimeLimit,
    timeLimitDate,
    hasQuantityLimit,
    quantityLimit,
    priceMode,
    priceEntered,
    priceTTC,
    priceNet,
    sumupFee,
    platformFee,
  } = bodyData;

  // Validation
  if (!sellerId) {
    return res.status(400).json({ message: 'sellerId est requis' });
  }

  if (!categorySlug) {
    return res.status(400).json({ message: 'Veuillez sélectionner une catégorie' });
  }

  // Vérifier que la catégorie existe
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return res.status(400).json({ message: 'Catégorie invalide' });
  }

  if (!title || title.length < 10) {
    return res.status(400).json({ message: 'Le titre doit contenir au moins 10 caractères' });
  }

  if (!description || description.length < 50) {
    return res.status(400).json({ message: 'La description doit contenir au moins 50 caractères' });
  }

  if (!formationType || !['en_ligne', 'pdf', 'visio'].includes(formationType)) {
    return res.status(400).json({ message: 'Type de formation invalide' });
  }

  if (formationType === 'visio' && !visioLink) {
    return res.status(400).json({ message: 'Le lien de visioconférence est requis' });
  }

  if (formationType === 'pdf' && !pdfFile) {
    return res.status(400).json({ message: 'Le fichier PDF est requis' });
  }

  if (!priceTTC || priceTTC <= 0) {
    return res.status(400).json({ message: 'Prix invalide' });
  }

  try {
    // Vérifier que le vendeur existe et est formateur
    const userCheck = await query(
      'SELECT id, roles FROM users WHERE id = $1',
      [sellerId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userCheck.rows[0];
    if (!user.roles || !user.roles.includes('formateur')) {
      return res.status(403).json({ message: 'Vous devez être formateur pour créer une formation' });
    }

    // Créer la formation d'abord pour obtenir l'ID
    const result = await query(
      `INSERT INTO formations (
        seller_id, category_slug, title, description, tags,
        formation_type, visio_link, visio_date, visio_duration,
        has_time_limit, time_limit_date,
        has_quantity_limit, quantity_limit, quantity_sold,
        price_mode, price_entered, price_ttc, price_net, sumup_fee, platform_fee,
        is_active, is_published
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11,
        $12, $13, 0,
        $14, $15, $16, $17, $18, $19,
        TRUE, TRUE
      ) RETURNING id, title, category_slug, price_ttc, created_at`,
      [
        sellerId, categorySlug, title, description, tags || [],
        formationType, visioLink, visioDate, visioDuration,
        hasTimeLimit, timeLimitDate,
        hasQuantityLimit, quantityLimit,
        priceMode, priceEntered, priceTTC, priceNet, sumupFee, platformFee
      ]
    );

    const formation = result.rows[0];

    // Si c'est un PDF, uploader vers Supabase Storage
    let pdfPath = null;
    if (formationType === 'pdf' && pdfFile && pdfFilePath) {
      try {
        // Lire le fichier
        const fileBuffer = fs.readFileSync(pdfFilePath);

        // Générer le chemin: formations/{formateurId}/{formationId}.pdf
        const storagePath = `formations/${sellerId}/${formation.id}.pdf`;

        // Upload vers Supabase
        const uploadResult = await uploadPDF(fileBuffer, storagePath, 'application/pdf');

        if (uploadResult.success) {
          pdfPath = uploadResult.path;

          // Mettre à jour la formation avec le chemin du PDF
          await query(
            'UPDATE formations SET pdf_path = $1 WHERE id = $2',
            [pdfPath, formation.id]
          );
        } else {
          console.error('Erreur upload PDF vers Supabase:', uploadResult.error);
          // Ne pas échouer la création, mais logger l'erreur
        }

        // Nettoyer le fichier temporaire
        fs.unlinkSync(pdfFilePath);
      } catch (uploadError) {
        console.error('Erreur lors de l\'upload du PDF:', uploadError);
        // Ne pas échouer la création de la formation
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Formation créée avec succès',
      formation: {
        id: formation.id,
        title: formation.title,
        categorySlug: formation.category_slug,
        priceTTC: formation.price_ttc,
        createdAt: formation.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating formation:', error);

    return res.status(500).json({
      message: 'Erreur lors de la création de la formation',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
