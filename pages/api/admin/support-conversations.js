/**
 * API Route: Admin Support Conversations
 *
 * GET - Récupérer toutes les conversations support
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

  let admin;
  try {
    admin = JSON.parse(userCookie);
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide' });
  }

  if (!admin.roles || !admin.roles.includes('admin')) {
    return res.status(403).json({ message: 'Accès admin requis' });
  }

  try {
    // Récupérer toutes les conversations support
    const conversations = await query(
      `SELECT
        c.id as conversation_id,
        c.last_message_at,
        c.created_at,
        u.id as user_id,
        u.prenom as user_prenom,
        u.nom as user_nom,
        u.pseudo as user_pseudo,
        u.email as user_email,
        (SELECT COUNT(*) FROM messages m
         WHERE m.conversation_id = c.id AND m.is_read = FALSE AND m.sender_id = u.id) as unread_count,
        (SELECT m.message FROM messages m
         WHERE m.conversation_id = c.id
         ORDER BY m.created_at DESC LIMIT 1) as last_message,
        (SELECT m.sender_id FROM messages m
         WHERE m.conversation_id = c.id
         ORDER BY m.created_at DESC LIMIT 1) as last_sender_id
      FROM conversations c
      JOIN users u ON c.user_id = u.id
      WHERE c.type = 'support'
      ORDER BY c.last_message_at DESC`,
      []
    );

    return res.status(200).json({
      conversations: conversations.rows.map(conv => ({
        conversationId: conv.conversation_id,
        user: {
          id: conv.user_id,
          prenom: conv.user_prenom,
          nom: conv.user_nom,
          pseudo: conv.user_pseudo,
          email: conv.user_email,
        },
        unreadCount: parseInt(conv.unread_count) || 0,
        lastMessage: conv.last_message,
        lastMessageAt: conv.last_message_at,
        lastMessageFromUser: conv.last_sender_id === conv.user_id,
        createdAt: conv.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching support conversations:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des conversations',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
