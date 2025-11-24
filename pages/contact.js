import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Simulation d'envoi (à remplacer par une vraie API plus tard)
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Nous Contacter - FormationPlace</title>
        <meta name="description" content="Contactez-nous pour toute question, suggestion ou demande d'assistance." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue to-cyan-500 text-white py-16 md:py-20">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Contactez-Nous
              </h1>
              <p className="text-lg md:text-xl drop-shadow-md opacity-95">
                Une question ? Une suggestion ? Notre équipe est là pour vous aider
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section md:py-20 py-12">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Formulaire de contact */}
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">Envoyez-nous un message</h2>

                {status.message && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    status.type === 'success'
                      ? 'bg-green bg-opacity-10 border border-green text-green'
                      : 'bg-red bg-opacity-10 border border-red text-red'
                  }`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-4 border-2 border-line rounded-xl focus:border-purple focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-4 border-2 border-line rounded-xl focus:border-purple focus:outline-none transition-colors"
                      placeholder="votre.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-4 border-2 border-line rounded-xl focus:border-purple focus:outline-none transition-colors"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border-2 border-line rounded-xl focus:border-purple focus:outline-none transition-colors resize-none"
                      placeholder="Votre message..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="button-main w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              </div>

              {/* Informations de contact */}
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">Autres moyens de contact</h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4 p-6 bg-surface rounded-2xl">
                    <div className="w-12 h-12 bg-purple bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ph-bold ph-envelope text-purple text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-secondary">contact@formationplace.com</p>
                      <p className="text-sm text-secondary mt-1">Réponse sous 24h</p>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="flex items-start gap-4 p-6 bg-surface rounded-2xl">
                    <div className="w-12 h-12 bg-green bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ph-bold ph-headset text-green text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Support</h3>
                      <p className="text-secondary">support@formationplace.com</p>
                      <p className="text-sm text-secondary mt-1">Assistance technique 24/7</p>
                    </div>
                  </div>

                  {/* Réseaux sociaux */}
                  <div className="flex items-start gap-4 p-6 bg-surface rounded-2xl">
                    <div className="w-12 h-12 bg-blue bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ph-bold ph-share-network text-blue text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Suivez-nous</h3>
                      <div className="flex gap-3">
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                          <i className="ph-bold ph-twitter-logo text-lg"></i>
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                          <i className="ph-bold ph-instagram-logo text-lg"></i>
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                          <i className="ph-bold ph-linkedin-logo text-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="p-6 bg-gradient-to-br from-purple to-pink text-white rounded-2xl">
                    <h3 className="font-semibold text-lg mb-2">Questions fréquentes ?</h3>
                    <p className="mb-4 opacity-90">Consultez notre FAQ pour des réponses rapides</p>
                    <a href="/faq" className="inline-block px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all">
                      Voir la FAQ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
