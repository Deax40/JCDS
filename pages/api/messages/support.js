/**
 * API Route: Support Messages (FormationPlace)
 *
 * GET - Récupérer les messages de support de l'utilisateur
 * POST - Envoyer un message au support
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  // Vérifier l'authentification
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

  if (req.method === 'GET') {
    try {
      // Récupérer ou créer la conversation support pour cet utilisateur
      let conversation = await query(
        `SELECT id FROM conversations
         WHERE type = 'support' AND user_id = $1`,
        [user.id]
      );

      let conversationId;
      if (conversation.rows.length === 0) {
        // Créer une nouvelle conversation support
        const newConv = await query(
          `INSERT INTO conversations (type, user_id)
           VALUES ('support', $1)
           RETURNING id`,
          [user.id]
        );
        conversationId = newConv.rows[0].id;
      } else {
        conversationId = conversation.rows[0].id;
      }

      // Récupérer tous les messages
      const messages = await query(
        `SELECT m.id, m.message, m.sender_id, m.is_read, m.created_at,
                u.prenom, u.nom, u.pseudo, u.roles
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at ASC`,
        [conversationId]
      );

      return res.status(200).json({
        conversationId,
        messages: messages.rows.map(msg => ({
          id: msg.id,
          message: msg.message,
          senderId: msg.sender_id,
          isFromUser: msg.sender_id === user.id,
          isFromAdmin: msg.roles && msg.roles.includes('admin'),
          senderName: msg.roles && msg.roles.includes('admin')
            ? 'FormationPlace Support'
            : `${msg.prenom} ${msg.nom}`,
          isRead: msg.is_read,
          createdAt: msg.created_at,
        })),
      });
    } catch (error) {
      console.error('Error fetching support messages:', error);
      return res.status(500).json({
        message: 'Erreur lors de la récupération des messages',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
      });
    }
  } else if (req.method === 'POST') {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message vide' });
    }

    try {
      // Récupérer ou créer la conversation
      let conversation = await query(
        `SELECT id FROM conversations
         WHERE type = 'support' AND user_id = $1`,
        [user.id]
      );

      let conversationId;
      if (conversation.rows.length === 0) {
        const newConv = await query(
          `INSERT INTO conversations (type, user_id)
           VALUES ('support', $1)
           RETURNING id`,
          [user.id]
        );
        conversationId = newConv.rows[0].id;
      } else {
        conversationId = conversation.rows[0].id;
      }

      // Insérer le message
      const newMessage = await query(
        `INSERT INTO messages (conversation_id, sender_id, message)
         VALUES ($1, $2, $3)
         RETURNING id, message, sender_id, is_read, created_at`,
        [conversationId, user.id, message.trim()]
      );

      return res.status(200).json({
        success: true,
        message: {
          id: newMessage.rows[0].id,
          message: newMessage.rows[0].message,
          senderId: newMessage.rows[0].sender_id,
          isFromUser: true,
          isFromAdmin: false,
          senderName: `${user.prenom} ${user.nom}`,
          isRead: newMessage.rows[0].is_read,
          createdAt: newMessage.rows[0].created_at,
        },
      });
    } catch (error) {
      console.error('Error sending support message:', error);
      return res.status(500).json({
        message: 'Erreur lors de l\'envoi du message',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
