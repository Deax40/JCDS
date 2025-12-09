/**
 * API Route: Admin - Deletion Requests
 *
 * Liste toutes les demandes de suppression avec détails complets
 *
 * GET /api/admin/deletion-requests
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
    // Récupérer toutes les demandes de suppression avec détails
    // Note: LEFT JOIN sur formations car les formations approuvées sont supprimées
    const result = await query(
      `SELECT
        fdr.id,
        fdr.formation_id,
        fdr.reason,
        fdr.status,
        fdr.requested_at,
        fdr.reviewed_at,
        fdr.admin_comment,
        f.title as formation_title,
        f.category_slug,
        f.price_ttc,
        f.quantity_sold,
        f.total_sales,
        f.total_revenue,
        f.seller_id,
        u.id as seller_user_id,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        u.pseudo as seller_pseudo,
        u.email as seller_email,
        reviewer.prenom as reviewer_prenom,
        reviewer.nom as reviewer_nom
      FROM formation_deletion_requests fdr
      LEFT JOIN formations f ON fdr.formation_id = f.id
      LEFT JOIN users u ON f.seller_id = u.id
      LEFT JOIN users reviewer ON fdr.reviewed_by = reviewer.id
      ORDER BY
        CASE fdr.status
          WHEN 'pending' THEN 1
          WHEN 'approved' THEN 2
          WHEN 'rejected' THEN 3
        END,
        fdr.requested_at DESC`,
      []
    );

    const requests = result.rows.map(row => ({
      id: row.id,
      formationId: row.formation_id,
      formationTitle: row.formation_title || `Formation #${row.formation_id} (supprimée)`,
      category: row.category_slug || 'N/A',
      priceTTC: parseFloat(row.price_ttc) || 0,
      quantitySold: row.quantity_sold || 0,
      totalSales: row.total_sales || 0,
      totalRevenue: parseFloat(row.total_revenue) || 0,
      reason: row.reason,
      status: row.status,
      requestedAt: row.requested_at,
      reviewedAt: row.reviewed_at,
      adminComment: row.admin_comment,
      formationDeleted: !row.formation_title, // La formation a été supprimée
      seller: row.seller_prenom ? {
        id: row.seller_user_id,
        prenom: row.seller_prenom,
        nom: row.seller_nom,
        pseudo: row.seller_pseudo,
        email: row.seller_email,
      } : null,
      reviewer: row.reviewer_prenom ? {
        prenom: row.reviewer_prenom,
        nom: row.reviewer_nom,
      } : null,
    }));

    return res.status(200).json({ requests });
  } catch (error) {
    console.error('Error fetching deletion requests:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des demandes',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
