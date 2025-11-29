import { useState, useEffect, useRef } from 'react';

export default function SupportChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
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
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple to-blue p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <i className="ph-bold ph-headset text-white text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-white">Support FormationPlace</h3>
              <p className="text-xs text-white text-opacity-80">En ligne</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <i className="ph-bold ph-x text-xl"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <i className="ph ph-circle-notch animate-spin text-4xl text-purple"></i>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <i className="ph-bold ph-chat-text text-6xl text-secondary mb-4"></i>
              <p className="text-secondary">Aucun message pour le moment</p>
              <p className="text-xs text-secondary mt-2">
                Envoyez votre premier message au support
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.isFromUser
                        ? 'bg-purple text-white rounded-br-none'
                        : msg.isFromAdmin
                        ? 'bg-gradient-to-r from-blue to-purple text-white rounded-bl-none'
                        : 'bg-white text-main rounded-bl-none shadow'
                    }`}
                  >
                    {!msg.isFromUser && (
                      <p className="text-xs opacity-80 mb-1 font-semibold">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.isFromUser || msg.isFromAdmin
                          ? 'text-white text-opacity-70'
                          : 'text-secondary'
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
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-line">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="px-6 py-3 bg-purple text-white rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <i className="ph ph-circle-notch animate-spin"></i>
              ) : (
                <i className="ph-bold ph-paper-plane-right"></i>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
