import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';

/**
 * Forgot Password Page
 *
 * Page de demande de réinitialisation de mot de passe
 *
 * Flow:
 * 1. L'utilisateur entre son email
 * 2. Un token de reset est généré et enregistré en base
 * 3. Un email avec le lien de reset est envoyé
 * 4. Message de confirmation affiché (sans révéler si le compte existe)
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Validation email
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!validateEmail(email)) {
      setError('L\'adresse email n&apos;est pas valide');
      return;
    }

    setLoading(true);

    try {
      // TODO: Appeler l'API pour demander un reset de mot de passe
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Toujours afficher le message de succès pour des raisons de sécurité
      // (ne pas révéler si le compte existe ou non)
      setSubmitted(true);
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Mot de passe oublié">
      <AuthCard
        icon="ph-lock-key"
        title="Mot de passe oublié ?"
        subtitle={!submitted ? "Nous allons vous envoyer un lien de réinitialisation" : ""}
      >
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Instructions */}
            <div className="bg-surface px-4 py-3 rounded-xl text-sm text-secondary">
              <p>
                Entrez l&apos;adresse email associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red bg-opacity-10 border border-red text-red px-4 py-3 rounded-xl text-sm">
                <i className="ph-bold ph-warning-circle mr-2"></i>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ph ph-envelope text-secondary text-xl"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-12 pr-4 py-3 border ${
                    error ? 'border-red' : 'border-line'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200`}
                  placeholder="vous@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple hover:to-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
            >
              {loading ? (
                <>
                  <i className="ph ph-circle-notch animate-spin mr-2 text-xl"></i>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <i className="ph-bold ph-paper-plane-tilt mr-2 text-xl"></i>
                  Envoyer le lien de réinitialisation
                </>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link
                href="/login"
                className="text-sm text-secondary hover:text-purple transition-colors duration-200 inline-flex items-center"
              >
                <i className="ph-bold ph-arrow-left mr-2"></i>
                Retour à la connexion
              </Link>
            </div>
          </form>
        ) : (
          /* Success Message */
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green bg-opacity-10 rounded-full mb-4">
                <i className="ph-bold ph-check-circle text-green text-4xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Email envoyé !
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
              </p>
              <p className="text-secondary text-sm mt-4">
                Le lien sera valide pendant <strong>1 heure</strong>.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-surface px-4 py-3 rounded-xl text-sm text-secondary">
              <p className="font-medium text-primary mb-2">
                <i className="ph-bold ph-info mr-2"></i>
                Vous ne trouvez pas l&apos;email ?
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Vérifiez votre dossier spam/courrier indésirable</li>
                <li>Assurez-vous d&apos;avoir utilisé la bonne adresse email</li>
                <li>Attendez quelques minutes, l&apos;email peut prendre du temps</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                  setError('');
                }}
                className="w-full flex justify-center items-center py-3 px-4 border border-line rounded-xl text-primary hover:bg-surface transition-all duration-200 font-medium"
              >
                <i className="ph-bold ph-arrow-counter-clockwise mr-2 text-xl"></i>
                Renvoyer un email
              </button>

              <Link
                href="/login"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple hover:to-purple transition-all duration-300 transform hover:scale-105 font-medium"
              >
                <i className="ph-bold ph-arrow-left mr-2 text-xl"></i>
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
