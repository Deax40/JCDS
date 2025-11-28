/**
 * API Route: Formation Messages (Acheteur-Formateur)
 *
 * GET - Récupérer les messages d'une formation achetée
 * POST - Envoyer un message au formateur (si achat validé)
 *
 * Query params: formationId
 */

import { query } from '../../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
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

  if (req.method === 'GET') {
    try {
      // Récupérer les infos de la formation
      const formationData = await query(
        `SELECT f.id, f.title, f.seller_id,
                u.prenom as seller_prenom, u.nom as seller_nom, u.pseudo as seller_pseudo
         FROM formations f
         JOIN users u ON f.seller_id = u.id
         WHERE f.id = $1`,
        [formationId]
      );

      if (formationData.rows.length === 0) {
        return res.status(404).json({ message: 'Formation non trouvée' });
      }

      const formation = formationData.rows[0];

      // Vérifier si l'utilisateur a acheté cette formation
      const purchaseCheck = await query(
        `SELECT id FROM purchases
         WHERE user_id = $1 AND formation_id = $2`,
        [user.id, formationId]
      );

      if (purchaseCheck.rows.length === 0) {
        return res.status(403).json({
          message: 'Vous devez acheter cette formation pour contacter le formateur',
        });
      }

      // Récupérer ou créer la conversation
      let conversation = await query(
        `SELECT id FROM conversations
         WHERE type = 'formation'
           AND user_id = $1
           AND seller_id = $2
           AND formation_id = $3`,
        [user.id, formation.seller_id, formationId]
      );

      let conversationId;
      if (conversation.rows.length === 0) {
        const newConv = await query(
          `INSERT INTO conversations (type, user_id, seller_id, formation_id)
           VALUES ('formation', $1, $2, $3)
           RETURNING id`,
          [user.id, formation.seller_id, formationId]
        );
        conversationId = newConv.rows[0].id;
      } else {
        conversationId = conversation.rows[0].id;
      }

      // Récupérer tous les messages
      const messages = await query(
        `SELECT m.id, m.message, m.sender_id, m.is_read, m.created_at,
                u.prenom, u.nom, u.pseudo
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at ASC`,
        [conversationId]
      );

      return res.status(200).json({
        conversationId,
        formation: {
          id: formation.id,
          title: formation.title,
          seller: {
            id: formation.seller_id,
            prenom: formation.seller_prenom,
            nom: formation.seller_nom,
            pseudo: formation.seller_pseudo,
          },
        },
        messages: messages.rows.map(msg => ({
          id: msg.id,
          message: msg.message,
          senderId: msg.sender_id,
          isFromUser: msg.sender_id === user.id,
          senderName: `${msg.prenom} ${msg.nom}`,
          senderPseudo: msg.pseudo,
          isRead: msg.is_read,
          createdAt: msg.created_at,
        })),
      });
    } catch (error) {
      console.error('Error fetching formation messages:', error);
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
      // Vérifier la formation
      const formationData = await query(
        `SELECT seller_id FROM formations WHERE id = $1`,
        [formationId]
      );

      if (formationData.rows.length === 0) {
        return res.status(404).json({ message: 'Formation non trouvée' });
      }

      const sellerId = formationData.rows[0].seller_id;

      // Vérifier l'achat
      const purchaseCheck = await query(
        `SELECT id FROM purchases
         WHERE user_id = $1 AND formation_id = $2`,
        [user.id, formationId]
      );

      if (purchaseCheck.rows.length === 0) {
        return res.status(403).json({
          message: 'Vous devez acheter cette formation pour contacter le formateur',
        });
      }

      // Récupérer ou créer la conversation
      let conversation = await query(
        `SELECT id FROM conversations
         WHERE type = 'formation'
           AND user_id = $1
           AND seller_id = $2
           AND formation_id = $3`,
        [user.id, sellerId, formationId]
      );

      let conversationId;
      if (conversation.rows.length === 0) {
        const newConv = await query(
          `INSERT INTO conversations (type, user_id, seller_id, formation_id)
           VALUES ('formation', $1, $2, $3)
           RETURNING id`,
          [user.id, sellerId, formationId]
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
          senderName: `${user.prenom} ${user.nom}`,
          senderPseudo: user.pseudo,
          isRead: newMessage.rows[0].is_read,
          createdAt: newMessage.rows[0].created_at,
        },
      });
    } catch (error) {
      console.error('Error sending formation message:', error);
      return res.status(500).json({
        message: 'Erreur lors de l\'envoi du message',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
