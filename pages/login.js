import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';

/**
 * Login Page
 *
 * Page de connexion moderne avec:
 * - Design clean et professionnel
 * - Validation des champs
 * - Messages d'erreur
 * - Liens vers register et forgot-password
 */
export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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
      // TODO: Appeler l'API de connexion
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion réussie - rediriger vers le dashboard ou la page d'accueil
        router.push('/account');
      } else {
        setGeneralError(data.message || 'Email ou mot de passe incorrect');
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
    <AuthLayout title="Connexion">
      <AuthCard
        icon="ph-sign-in"
        title="Connexion"
        subtitle="Accédez à votre espace formation"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'erreur général */}
          {generalError && (
            <div className="bg-red bg-opacity-10 border border-red text-red px-4 py-3 rounded-xl text-sm">
              <i className="ph-bold ph-warning-circle mr-2"></i>
              {generalError}
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
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3 border ${
                  errors.email ? 'border-red' : 'border-line'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200`}
                placeholder="vous@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ph ph-lock text-secondary text-xl"></i>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-purple hover:text-blue transition-colors duration-200"
            >
              Mot de passe oublié ?
            </Link>
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
                Connexion en cours...
              </>
            ) : (
              <>
                <i className="ph-bold ph-sign-in mr-2 text-xl"></i>
                Se connecter
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-secondary">
              Vous n'avez pas de compte ?{' '}
              <Link
                href="/register"
                className="font-medium text-purple hover:text-blue transition-colors duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
