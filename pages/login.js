import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
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
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Connexion réussie - rediriger vers le profil
        router.push('/mon-compte');
      } else {
        setGeneralError(result.message || 'Email ou mot de passe incorrect');
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
    <>
      <Head>
        <title>Connexion - FormationPlace</title>
        <meta name="description" content="Connectez-vous à votre compte FormationPlace" />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="login-page pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="heading3 mb-3">Connexion</h1>
                <p className="text-secondary">Accédez à votre compte FormationPlace</p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
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
              href="/support"
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
                S'inscrire
              </Link>
            </p>
          </div>
                </form>
              </div>

              {/* Info */}
              <div className="mt-8 bg-blue bg-opacity-10 border border-blue rounded-xl p-4">
                <p className="text-sm text-center text-secondary">
                  <i className="ph-bold ph-info mr-2"></i>
                  Créez un compte gratuitement pour accéder à toutes les fonctionnalités
                </p>
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
