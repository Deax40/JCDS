/**
 * API Route: Admin Statistics
 *
 * Statistiques globales de la plateforme
 *
 * GET /api/admin/stats
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
    // Nombre total d'utilisateurs
    const usersCount = await query('SELECT COUNT(*) as count FROM users', []);

    // Nombre de formateurs
    const formateursCount = await query(
      "SELECT COUNT(*) as count FROM users WHERE roles @> ARRAY['formateur']::VARCHAR[]",
      []
    );

    // Nombre d'acheteurs
    const acheteursCount = await query(
      "SELECT COUNT(*) as count FROM users WHERE roles @> ARRAY['acheteur']::VARCHAR[]",
      []
    );

    // Nombre total de formations
    const formationsCount = await query('SELECT COUNT(*) as count FROM formations', []);

    // Nombre de formations actives
    const activeFormationsCount = await query(
      'SELECT COUNT(*) as count FROM formations WHERE is_published = TRUE AND is_active = TRUE',
      []
    );

    // Nombre de demandes de suppression en attente
    const pendingDeletionsCount = await query(
      'SELECT COUNT(*) as count FROM formation_deletion_requests WHERE status = $1',
      ['pending']
    );

    // Nombre total de ventes
    const purchasesCount = await query('SELECT COUNT(*) as count FROM purchases', []);

    // Revenu total (somme des price_net)
    const revenueData = await query(
      'SELECT SUM(price_net) as total_revenue, SUM(price_ttc) as total_sales FROM purchases',
      []
    );

    // Top 5 formations par ventes
    const topFormations = await query(
      `SELECT f.id, f.title, f.quantity_sold, u.pseudo as seller_pseudo
       FROM formations f
       JOIN users u ON f.seller_id = u.id
       ORDER BY f.quantity_sold DESC
       LIMIT 5`,
      []
    );

    // Top 5 formateurs par ventes
    const topFormateurs = await query(
      `SELECT u.id, u.pseudo, u.prenom, u.nom,
              COUNT(DISTINCT f.id) as formations_count,
              SUM(f.quantity_sold) as total_sales
       FROM users u
       JOIN formations f ON u.id = f.seller_id
       WHERE u.roles @> ARRAY['formateur']::VARCHAR[]
       GROUP BY u.id
       ORDER BY total_sales DESC
       LIMIT 5`,
      []
    );

    return res.status(200).json({
      users: {
        total: parseInt(usersCount.rows[0].count) || 0,
        formateurs: parseInt(formateursCount.rows[0].count) || 0,
        acheteurs: parseInt(acheteursCount.rows[0].count) || 0,
      },
      formations: {
        total: parseInt(formationsCount.rows[0].count) || 0,
        active: parseInt(activeFormationsCount.rows[0].count) || 0,
        pendingDeletions: parseInt(pendingDeletionsCount.rows[0].count) || 0,
      },
      sales: {
        total: parseInt(purchasesCount.rows[0].count) || 0,
        totalRevenue: parseFloat(revenueData.rows[0].total_revenue) || 0,
        totalSales: parseFloat(revenueData.rows[0].total_sales) || 0,
      },
      topFormations: topFormations.rows.map(row => ({
        id: row.id,
        title: row.title,
        sales: row.quantity_sold || 0,
        sellerPseudo: row.seller_pseudo,
      })),
      topFormateurs: topFormateurs.rows.map(row => ({
        id: row.id,
        pseudo: row.pseudo,
        prenom: row.prenom,
        nom: row.nom,
        formationsCount: parseInt(row.formations_count) || 0,
        totalSales: parseInt(row.total_sales) || 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
