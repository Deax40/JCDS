/**
 * API Route: Admin - All Formations
 *
 * Liste toutes les formations avec informations de modération
 * Inclut les demandes de suppression en attente
 *
 * GET /api/admin/formations
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Vérifier que l'utilisateur est admin
  const cookies = cookie.parse(req.headers.cookie || '');
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  let admin;
  try {
    admin = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  if (!admin.roles || !admin.roles.includes('admin')) {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }

  try {
    // Récupérer toutes les formations avec leurs vendeurs et demandes de suppression
    const result = await query(
      `SELECT
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.price_ttc,
        f.price_net,
        f.formation_type,
        f.quantity_sold,
        f.is_published,
        f.is_active,
        f.deletion_requested,
        f.deletion_requested_at,
        f.deletion_reason,
        f.created_at,
        u.id as seller_id,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        u.pseudo as seller_pseudo,
        u.email as seller_email,
        dr.id as deletion_request_id,
        dr.status as deletion_status,
        dr.requested_at as deletion_date
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      LEFT JOIN formation_deletion_requests dr ON f.id = dr.formation_id AND dr.status = 'pending'
      ORDER BY f.created_at DESC`,
      []
    );

    const formations = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category_slug,
      priceTTC: parseFloat(row.price_ttc) || 0,
      priceNet: parseFloat(row.price_net) || 0,
      formationType: row.formation_type,
      quantitySold: row.quantity_sold || 0,
      isPublished: row.is_published,
      isActive: row.is_active,
      deletionRequested: row.deletion_requested,
      deletionRequestedAt: row.deletion_requested_at,
      deletionReason: row.deletion_reason,
      createdAt: row.created_at,
      seller: {
        id: row.seller_id,
        prenom: row.seller_prenom,
        nom: row.seller_nom,
        pseudo: row.seller_pseudo,
        email: row.seller_email,
      },
      deletionRequest: row.deletion_request_id ? {
        id: row.deletion_request_id,
        status: row.deletion_status,
        requestedAt: row.deletion_date,
      } : null,
    }));

    return res.status(200).json({ formations });
  } catch (error) {
    console.error('Error fetching formations for admin:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des formations',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
