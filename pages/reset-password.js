import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';

/**
 * Reset Password Page
 *
 * Page de réinitialisation du mot de passe avec token
 *
 * Flow:
 * 1. Vérification du token (au chargement de la page)
 * 2. Si valide: afficher le formulaire de nouveau mot de passe
 * 3. Si invalide/expiré: afficher un message d'erreur
 * 4. Soumission: mettre à jour le mot de passe et invalider le token
 */
export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);

  // Vérifier le token au chargement
  useEffect(() => {
    if (!token) {
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    setVerifying(true);

    try {
      // TODO: Appeler l'API pour vérifier le token
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setGeneralError(data.message || 'Le lien de réinitialisation est invalide ou a expiré.');
      }
    } catch (error) {
      setTokenValid(false);
      setGeneralError('Une erreur est survenue lors de la vérification du lien.');
    } finally {
      setVerifying(false);
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Appeler l'API pour réinitialiser le mot de passe
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setGeneralError(data.message || 'Une erreur est survenue lors de la réinitialisation');
      }
    } catch (error) {
      setGeneralError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <AuthLayout title="Réinitialiser le mot de passe">
      <AuthCard
        icon={success ? "ph-check-circle" : tokenValid ? "ph-lock-key" : "ph-warning-circle"}
        title={success ? "Mot de passe modifié !" : tokenValid ? "Nouveau mot de passe" : "Lien invalide"}
        subtitle={success ? "Votre mot de passe a été mis à jour avec succès" : tokenValid ? "Choisissez un nouveau mot de passe sécurisé" : ""}
      >
        {/* Vérification du token en cours */}
        {verifying && (
          <div className="text-center py-8">
            <i className="ph ph-circle-notch animate-spin text-purple text-5xl mb-4"></i>
            <p className="text-secondary">Vérification du lien...</p>
          </div>
        )}

        {/* Token invalide ou expiré */}
        {!verifying && !tokenValid && (
          <div className="space-y-6">
            <div className="bg-red bg-opacity-10 border border-red text-red px-4 py-3 rounded-xl text-sm">
              <i className="ph-bold ph-warning-circle mr-2"></i>
              {generalError}
            </div>

            <div className="text-center text-secondary text-sm">
              <p className="mb-4">
                Le lien de réinitialisation peut être invalide ou avoir expiré.
              </p>
              <p>
                Les liens de réinitialisation sont valides pendant 1 heure.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/forgot-password"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple hover:to-purple transition-all duration-300 transform hover:scale-105 font-medium"
              >
                <i className="ph-bold ph-paper-plane-tilt mr-2 text-xl"></i>
                Demander un nouveau lien
              </Link>

              <Link
                href="/login"
                className="w-full flex justify-center items-center py-3 px-4 border border-line rounded-xl text-primary hover:bg-surface transition-all duration-200 font-medium"
              >
                <i className="ph-bold ph-arrow-left mr-2 text-xl"></i>
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}

        {/* Formulaire de réinitialisation */}
        {!verifying && tokenValid && !success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message d'erreur général */}
            {generalError && (
              <div className="bg-red bg-opacity-10 border border-red text-red px-4 py-3 rounded-xl text-sm">
                <i className="ph-bold ph-warning-circle mr-2"></i>
                {generalError}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-surface px-4 py-3 rounded-xl text-sm text-secondary">
              <p>
                Votre nouveau mot de passe doit contenir au moins 6 caractères.
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ph ph-lock text-secondary text-xl"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3 border ${
                    errors.password ? 'border-red' : 'border-line'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ph ph-lock-key text-secondary text-xl"></i>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3 border ${
                    errors.confirmPassword ? 'border-red' : 'border-line'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red">{errors.confirmPassword}</p>
              )}
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
                  Réinitialisation en cours...
                </>
              ) : (
                <>
                  <i className="ph-bold ph-check mr-2 text-xl"></i>
                  Réinitialiser le mot de passe
                </>
              )}
            </button>
          </form>
        )}

        {/* Succès */}
        {!verifying && success && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green bg-opacity-10 rounded-full mb-4">
                <i className="ph-bold ph-check-circle text-green text-4xl"></i>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple hover:to-purple transition-all duration-300 transform hover:scale-105 font-medium"
            >
              <i className="ph-bold ph-sign-in mr-2 text-xl"></i>
              Se connecter
            </Link>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
