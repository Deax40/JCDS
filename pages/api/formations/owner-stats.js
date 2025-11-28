/**
 * API Route: Formation Owner Stats
 *
 * Statistiques détaillées visibles uniquement par le propriétaire de la formation
 * - Nombre de personnes qui ont mis dans le panier
 * - Nombre de personnes qui ont mis en favoris
 * - Détails des ventes, revenus, etc.
 *
 * GET /api/formations/owner-stats?formationId=123
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Récupérer l'utilisateur depuis les cookies
  const cookies = cookie.parse(req.headers.cookie || '');
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  const { formationId } = req.query;

  if (!formationId) {
    return res.status(400).json({ message: 'Formation ID requis' });
  }

  try {
    // Vérifier que la formation appartient à l'utilisateur
    const formationCheck = await query(
      'SELECT id, seller_id, title FROM formations WHERE id = $1',
      [formationId]
    );

    if (formationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const formation = formationCheck.rows[0];

    if (formation.seller_id !== user.id) {
      return res.status(403).json({ message: 'Accès non autorisé - vous n\'êtes pas le propriétaire' });
    }

    // Récupérer le nombre de personnes qui ont ajouté au panier
    const cartCount = await query(
      'SELECT COUNT(DISTINCT user_id) as count FROM cart_items WHERE formation_id = $1',
      [formationId]
    );

    // Récupérer le nombre de personnes qui ont ajouté aux favoris
    const favoritesCount = await query(
      'SELECT COUNT(DISTINCT user_id) as count FROM favorites WHERE formation_id = $1',
      [formationId]
    );

    // Récupérer le nombre total de ventes
    const salesCount = await query(
      'SELECT COUNT(*) as count FROM purchases WHERE formation_id = $1',
      [formationId]
    );

    // Récupérer les revenus totaux (somme des price_net)
    const revenueData = await query(
      `SELECT
        SUM(price_net) as total_revenue,
        SUM(price_ttc) as total_sales_amount
       FROM purchases
       WHERE formation_id = $1`,
      [formationId]
    );

    // Récupérer les vues uniques (si on trackait les vues)
    // Pour l'instant, on retourne 0
    const viewsCount = 0;

    return res.status(200).json({
      formationTitle: formation.title,
      stats: {
        inCart: parseInt(cartCount.rows[0].count) || 0,
        inFavorites: parseInt(favoritesCount.rows[0].count) || 0,
        totalSales: parseInt(salesCount.rows[0].count) || 0,
        totalRevenue: parseFloat(revenueData.rows[0].total_revenue) || 0,
        totalSalesAmount: parseFloat(revenueData.rows[0].total_sales_amount) || 0,
        uniqueViews: viewsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
