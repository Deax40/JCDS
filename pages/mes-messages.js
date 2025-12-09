import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';

export default function MesMessages() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/mes-messages');
      return;
    }
    loadMessages();
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages/support', {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setConversationId(data.conversationId);
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...messages, data.message]);
        setNewMessage('');
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

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Mes Messages | FormationPlace</title>
      </Head>

      <HeaderAnvogue />

      <div className="min-h-screen bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/mon-compte"
                className="text-purple hover:text-opacity-80 transition"
              >
                <i className="ph-bold ph-arrow-left text-xl"></i>
              </Link>
              <div>
                <h1 className="heading4">Mes Messages</h1>
                <p className="text-secondary">Support FormationPlace</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <i className="ph ph-circle-notch animate-spin text-6xl text-purple"></i>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg h-[700px] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-line bg-gradient-to-r from-purple to-blue">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <i className="ph-bold ph-headset text-white text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="heading6 text-white">Support FormationPlace</h2>
                    <p className="text-sm text-white text-opacity-80">En ligne</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <i className="ph-bold ph-chat-text text-8xl text-secondary mb-4"></i>
                    <h3 className="heading6 mb-2">Aucun message</h3>
                    <p className="text-secondary">
                      Envoyez votre premier message au support
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={'flex ' + (msg.isFromUser ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={'max-w-[70%] rounded-2xl px-4 py-3 ' + 
                            (msg.isFromUser
                              ? 'bg-purple text-white rounded-br-none'
                              : msg.isFromAdmin
                              ? 'bg-gradient-to-r from-blue to-purple text-white rounded-bl-none'
                              : 'bg-surface text-main rounded-bl-none')}
                        >
                          {!msg.isFromUser && (
                            <p className="text-xs opacity-80 mb-1 font-semibold">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>
                          <p
                            className={'text-xs mt-1 ' + 
                              (msg.isFromUser || msg.isFromAdmin
                                ? 'text-white text-opacity-70'
                                : 'text-secondary')}
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
                  </>
                )}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-6 border-t border-line">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-3 bg-purple text-white rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sending ? (
                      <i className="ph ph-circle-notch animate-spin"></i>
                    ) : (
                      <>
                        <i className="ph-bold ph-paper-plane-right"></i>
                        <span className="max-sm:hidden">Envoyer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <FooterAnvogue />
    </>
  );
}
