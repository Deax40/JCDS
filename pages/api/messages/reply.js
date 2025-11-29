/**
 * API Route: Reply to Message
 *
 * POST - Envoyer une réponse dans une conversation existante
 *
 * Body: { conversationId, message }
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const { conversationId, message } = req.body;

  if (!conversationId || !message || message.trim().length === 0) {
    return res.status(400).json({ message: 'Conversation ID et message requis' });
  }

  try {
    // Vérifier que la conversation existe et que l'utilisateur a le droit d'y répondre
    const conversation = await query(
      `SELECT type, user_id, seller_id FROM conversations WHERE id = $1`,
      [conversationId]
    );

    if (conversation.rows.length === 0) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    const conv = conversation.rows[0];

    // Vérifier les permissions
    const isAdmin = user.roles && user.roles.includes('admin');
    const isParticipant =
      conv.user_id === user.id ||
      conv.seller_id === user.id;

    // Pour support: seul l'utilisateur ou un admin peut répondre
    // Pour formation: seul l'acheteur ou le vendeur peut répondre
    if (conv.type === 'support') {
      if (!isAdmin && conv.user_id !== user.id) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
    } else if (conv.type === 'formation') {
      if (!isParticipant) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
    }

    // Insérer le message
    const newMessage = await query(
      `INSERT INTO messages (conversation_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING id, message, sender_id, is_read, created_at`,
      [conversationId, user.id, message.trim()]
    );

    // Marquer les messages précédents comme lus
    await query(
      `UPDATE messages
       SET is_read = TRUE
       WHERE conversation_id = $1 AND sender_id != $2`,
      [conversationId, user.id]
    );

    const senderName = isAdmin
      ? 'FormationPlace Support'
      : `${user.prenom} ${user.nom}`;

    return res.status(200).json({
      success: true,
      message: {
        id: newMessage.rows[0].id,
        message: newMessage.rows[0].message,
        senderId: newMessage.rows[0].sender_id,
        senderName,
        isFromUser: true,
        isFromAdmin: isAdmin,
        isRead: newMessage.rows[0].is_read,
        createdAt: newMessage.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    return res.status(500).json({
      message: 'Erreur lors de l\'envoi du message',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
