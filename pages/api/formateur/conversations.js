/**
 * API Route: Formateur Conversations
 *
 * GET - Récupérer toutes les conversations des formations du formateur
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

  if (!user.roles || !user.roles.includes('formateur')) {
    return res.status(403).json({ message: 'Accès formateur requis' });
  }

  try {
    // Récupérer toutes les conversations où l'utilisateur est le vendeur
    const conversations = await query(
      `SELECT
        c.id as conversation_id,
        c.formation_id,
        c.last_message_at,
        f.title as formation_title,
        u.id as buyer_id,
        u.prenom as buyer_prenom,
        u.nom as buyer_nom,
        u.pseudo as buyer_pseudo,
        (SELECT COUNT(*) FROM messages m
         WHERE m.conversation_id = c.id AND m.is_read = FALSE AND m.sender_id != $1) as unread_count,
        (SELECT m.message FROM messages m
         WHERE m.conversation_id = c.id
         ORDER BY m.created_at DESC LIMIT 1) as last_message
      FROM conversations c
      JOIN formations f ON c.formation_id = f.id
      JOIN users u ON c.user_id = u.id
      WHERE c.type = 'formation' AND c.seller_id = $1
      ORDER BY c.last_message_at DESC`,
      [user.id]
    );

    return res.status(200).json({
      conversations: conversations.rows.map(conv => ({
        conversationId: conv.conversation_id,
        formationId: conv.formation_id,
        formationTitle: conv.formation_title,
        buyer: {
          id: conv.buyer_id,
          prenom: conv.buyer_prenom,
          nom: conv.buyer_nom,
          pseudo: conv.buyer_pseudo,
        },
        unreadCount: parseInt(conv.unread_count) || 0,
        lastMessage: conv.last_message,
        lastMessageAt: conv.last_message_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching formateur conversations:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des conversations',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
