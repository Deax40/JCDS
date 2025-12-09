/**
 * API Route: Admin Conversation Messages
 *
 * GET - Récupérer les messages d'une conversation spécifique
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

  const { conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ message: 'ID de conversation requis' });
  }

  try {
    // Vérifier que la conversation existe et est de type support
    const conversation = await query(
      `SELECT id, user_id FROM conversations WHERE id = $1 AND type = 'support'`,
      [conversationId]
    );

    if (conversation.rows.length === 0) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    // Récupérer tous les messages de cette conversation
    const messages = await query(
      `SELECT m.id, m.message, m.sender_id, m.is_read, m.created_at,
              u.prenom, u.nom, u.pseudo, u.roles
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [conversationId]
    );

    // Marquer les messages de l'utilisateur comme lus
    await query(
      `UPDATE messages SET is_read = TRUE
       WHERE conversation_id = $1 AND sender_id != $2`,
      [conversationId, admin.id]
    );

    return res.status(200).json({
      conversationId,
      userId: conversation.rows[0].user_id,
      messages: messages.rows.map(msg => ({
        id: msg.id,
        message: msg.message,
        senderId: msg.sender_id,
        isFromUser: msg.sender_id === conversation.rows[0].user_id,
        isFromAdmin: msg.roles && msg.roles.includes('admin'),
        senderName: msg.roles && msg.roles.includes('admin')
          ? 'FormationPlace Support'
          : `${msg.prenom} ${msg.nom}`,
        isRead: msg.is_read,
        createdAt: msg.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des messages',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
