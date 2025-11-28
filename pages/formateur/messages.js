import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import { useAuth } from '../../context/AuthContext';

export default function FormateurMessages() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/formateur/messages');
      return;
    }

    if (user && (!user.roles || !user.roles.includes('formateur'))) {
      router.push('/mon-compte');
      return;
    }

    loadConversations();
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/formateur/conversations');
      const data = await response.json();

      if (response.ok) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId, formationId) => {
    try {
      const response = await fetch(`/api/messages/formation?formationId=${formationId}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setSelectedConversation({
          conversationId: data.conversationId,
          formation: data.formation,
          buyer: conversations.find(c => c.conversationId === conversationId)?.buyer,
        });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedConversation) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.conversationId,
          message: newMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...messages, data.message]);
        setNewMessage('');
        loadConversations(); // Refresh conversations list
      } else {
        alert(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  if (!user || !user.roles?.includes('formateur')) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Messages - Formateur | FormationPlace</title>
      </Head>

      <HeaderAnvogue />

      <div className="min-h-screen bg-surface py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/formateur/dashboard"
                className="text-purple hover:text-opacity-80 transition"
              >
                <i className="ph-bold ph-arrow-left text-xl"></i>
              </Link>
              <div>
                <h1 className="heading4">Messagerie</h1>
                <p className="text-secondary">Conversations avec vos acheteurs</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <i className="ph ph-circle-notch animate-spin text-6xl text-purple"></i>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-3 h-[700px]">
                {/* Conversations List */}
                <div className="border-r border-line overflow-y-auto">
                  <div className="p-4 border-b border-line bg-surface">
                    <h3 className="heading6">Conversations ({conversations.length})</h3>
                  </div>

                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <i className="ph-bold ph-chat-text text-6xl text-secondary mb-4"></i>
                      <p className="text-secondary">Aucune conversation pour le moment</p>
                      <p className="text-xs text-secondary mt-2">
                        Les acheteurs de vos formations pourront vous contacter ici
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-line">
                      {conversations.map((conv) => (
                        <button
                          key={conv.conversationId}
                          onClick={() => loadMessages(conv.conversationId, conv.formationId)}
                          className={`w-full p-4 text-left hover:bg-surface transition ${
                            selectedConversation?.conversationId === conv.conversationId
                              ? 'bg-purple bg-opacity-5'
                              : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple bg-opacity-10 flex items-center justify-center flex-shrink-0">
                              <i className="ph-bold ph-user text-purple"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold truncate">
                                  {conv.buyer.prenom} {conv.buyer.nom}
                                </p>
                                {conv.unreadCount > 0 && (
                                  <span className="w-5 h-5 bg-red text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-purple mb-1 truncate">
                                {conv.formationTitle}
                              </p>
                              <p className="text-xs text-secondary truncate">
                                {conv.lastMessage}
                              </p>
                              <p className="text-xs text-secondary mt-1">
                                {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div className="md:col-span-2 flex flex-col">
                  {!selectedConversation ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <i className="ph-bold ph-chats text-8xl text-secondary mb-4"></i>
                      <p className="text-secondary">
                        Sélectionnez une conversation pour commencer
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Conversation Header */}
                      <div className="p-4 border-b border-line bg-surface">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple bg-opacity-10 flex items-center justify-center">
                            <i className="ph-bold ph-user text-purple"></i>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {selectedConversation.buyer?.prenom}{' '}
                              {selectedConversation.buyer?.nom}
                            </p>
                            <p className="text-xs text-purple">
                              {selectedConversation.formation?.title}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                          <div
                            key={msg.id || index}
                            className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                msg.isFromUser
                                  ? 'bg-purple text-white rounded-br-none'
                                  : 'bg-surface text-main rounded-bl-none'
                              }`}
                            >
                              {!msg.isFromUser && (
                                <p className="text-xs opacity-70 mb-1 font-semibold">
                                  {msg.senderName}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.isFromUser ? 'text-white text-opacity-70' : 'text-secondary'
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <form onSubmit={sendMessage} className="p-4 border-t border-line">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Votre réponse..."
                            className="flex-1 px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                            disabled={sending}
                          />
                          <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="px-6 py-3 bg-purple text-white rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sending ? (
                              <i className="ph ph-circle-notch animate-spin"></i>
                            ) : (
                              <i className="ph-bold ph-paper-plane-right"></i>
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterAnvogue />
    </>
  );
}
