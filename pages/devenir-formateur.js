import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';

export default function DevenirFormateurPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    raison: '',
    typeFormation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Rediriger si non connecté
    if (!user) {
      router.push('/login?redirect=/devenir-formateur');
    }
  }, [user, router]);

  // Rediriger si déjà formateur
  useEffect(() => {
    if (user && user.roles && user.roles.includes('formateur')) {
      router.push('/formateur/dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.raison || formData.raison.length < 50) {
      setError('Veuillez expliquer votre motivation (minimum 50 caractères)');
      return;
    }

    if (!formData.typeFormation || formData.typeFormation.length < 10) {
      setError('Veuillez décrire le type de formation que vous souhaitez vendre (minimum 10 caractères)');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Sauvegarder dans la base de données
      const dbResponse = await fetch('/api/formateur/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          raison: formData.raison,
          typeFormation: formData.typeFormation,
        }),
      });

      const dbResult = await dbResponse.json();

      if (!dbResponse.ok) {
        setError(dbResult.message || 'Erreur lors de l\'enregistrement de la candidature');
        setIsSubmitting(false);
        return;
      }

      // 2. Envoyer par email via Web3Forms
      try {
        const web3FormData = new FormData();
        web3FormData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY'); // À REMPLACER PAR VOTRE CLÉ
        web3FormData.append('subject', `Nouvelle demande formateur - ${user.prenom} ${user.nom}`);
        web3FormData.append('from_name', 'FormationPlace - Candidature Formateur');
        web3FormData.append('Nom', `${user.prenom} ${user.nom}`);
        web3FormData.append('Email', user.email);
        web3FormData.append('Pseudo', user.pseudo);
        web3FormData.append('ID Utilisateur', user.id);
        web3FormData.append('Téléphone', user.telephone);
        web3FormData.append('Raison de la candidature', formData.raison);
        web3FormData.append('Type de formations', formData.typeFormation);

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3FormData,
        });
        // Note: On ne bloque pas si l'email échoue
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Continuer même si l'email échoue
      }

      // 3. Rediriger vers la page de confirmation
      router.push('/devenir-formateur/confirmation');
    } catch (err) {
      console.error('Erreur soumission formulaire:', err);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Afficher rien pendant la redirection
  }

  return (
    <>
      <Head>
        <title>Devenir Formateur - FormationPlace</title>
        <meta name="description" content="Postulez pour devenir formateur et vendre vos formations sur FormationPlace" />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple via-pink to-orange text-white py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Devenir Formateur
              </h1>
              <p className="text-lg md:text-xl opacity-95">
                Partagez votre expertise et générez des revenus en vendant vos formations
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="py-16 bg-surface">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {/* Informations pré-remplies */}
                <div className="mb-8 p-6 bg-purple bg-opacity-5 rounded-xl border border-purple border-opacity-20">
                  <h3 className="heading6 mb-4 flex items-center">
                    <i className="ph-bold ph-user-circle text-purple mr-2 text-2xl"></i>
                    Vos informations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary">Nom complet:</span>
                      <p className="font-semibold">{user.prenom} {user.nom}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Email:</span>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Pseudo:</span>
                      <p className="font-semibold">@{user.pseudo}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Téléphone:</span>
                      <p className="font-semibold">{user.telephone}</p>
                    </div>
                  </div>
                </div>

                <h2 className="heading4 mb-6">Formulaire de candidature</h2>
                <p className="text-secondary mb-8">
                  Complétez ce formulaire pour postuler en tant que formateur. Notre équipe vous contactera sous 24h avec le formulaire complet.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Raison */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Pourquoi souhaitez-vous devenir formateur sur notre plateforme ? *
                    </label>
                    <textarea
                      name="raison"
                      value={formData.raison}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple resize-none"
                      placeholder="Expliquez vos motivations, votre expérience, et ce que vous apporterez aux apprenants... (minimum 50 caractères)"
                    />
                    <p className="text-xs text-secondary mt-1">
                      {formData.raison.length} caractères (minimum 50)
                    </p>
                  </div>

                  {/* Type de formation */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Quel type de formations souhaitez-vous vendre ? *
                    </label>
                    <textarea
                      name="typeFormation"
                      value={formData.typeFormation}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple resize-none"
                      placeholder="Décrivez les thématiques, domaines d'expertise, sujets que vous souhaitez enseigner... (minimum 10 caractères)"
                    />
                    <p className="text-xs text-secondary mt-1">
                      {formData.typeFormation.length} caractères (minimum 10)
                    </p>
                  </div>

                  {/* Message d'erreur */}
                  {error && (
                    <div className="p-4 bg-red bg-opacity-10 border border-red border-opacity-20 rounded-xl text-red text-sm">
                      <i className="ph-bold ph-warning-circle mr-2"></i>
                      {error}
                    </div>
                  )}

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple to-blue text-white rounded-xl font-semibold hover:from-purple hover:to-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ph ph-circle-notch animate-spin text-xl"></i>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-paper-plane-tilt text-xl"></i>
                        Envoyer ma candidature
                      </>
                    )}
                  </button>

                  <p className="text-xs text-secondary text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe dans les 24h.
                  </p>
                </form>
              </div>

              {/* Info box */}
              <div className="mt-8 p-6 bg-blue bg-opacity-5 rounded-xl border border-blue border-opacity-20">
                <div className="flex gap-4">
                  <i className="ph-bold ph-info text-blue text-2xl flex-shrink-0"></i>
                  <div>
                    <h4 className="font-semibold mb-2">Que se passe-t-il ensuite ?</h4>
                    <ul className="text-sm text-secondary space-y-2">
                      <li className="flex items-start">
                        <i className="ph-bold ph-check text-green mr-2 mt-0.5"></i>
                        Votre candidature est envoyée à notre équipe
                      </li>
                      <li className="flex items-start">
                        <i className="ph-bold ph-check text-green mr-2 mt-0.5"></i>
                        Vous recevrez un email de confirmation dans les 24h
                      </li>
                      <li className="flex items-start">
                        <i className="ph-bold ph-check text-green mr-2 mt-0.5"></i>
                        Un formulaire complet vous sera envoyé pour finaliser votre inscription
                      </li>
                      <li className="flex items-start">
                        <i className="ph-bold ph-check text-green mr-2 mt-0.5"></i>
                        Vous pourrez commencer à créer et vendre vos formations !
                      </li>
                    </ul>
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
