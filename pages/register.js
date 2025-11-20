import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';

/**
 * Register Page
 *
 * Page d'inscription moderne avec:
 * - Validation complète des champs
 * - Vérification de la correspondance des mots de passe
 * - Rôle par défaut : acheteur
 * - Design moderne et professionnel
 */
export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Nom
    if (!formData.name) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Confirm Password
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
      // TODO: Appeler l'API d'inscription
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'buyer' // Rôle par défaut: acheteur
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Inscription réussie - rediriger vers la page de login ou directement vers le compte
        router.push('/login?registered=true');
      } else {
        setGeneralError(data.message || 'Une erreur est survenue lors de l\'inscription');
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
    <AuthLayout title="Inscription">
      <AuthCard
        icon="ph-user-plus"
        title="Créer un compte"
        subtitle="Rejoignez FormationPlace et commencez à apprendre"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Message d'erreur général */}
          {generalError && (
            <div className="bg-red bg-opacity-10 border border-red text-red px-4 py-3 rounded-xl text-sm">
              <i className="ph-bold ph-warning-circle mr-2"></i>
              {generalError}
            </div>
          )}

          {/* Info: Rôle par défaut */}
          <div className="bg-blue bg-opacity-10 border border-blue text-blue px-4 py-3 rounded-xl text-sm">
            <i className="ph-bold ph-info mr-2"></i>
            Vous serez inscrit en tant qu'<strong>acheteur</strong>. Vous pourrez activer le mode vendeur plus tard depuis votre compte.
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ph ph-user text-secondary text-xl"></i>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3 border ${
                  errors.name ? 'border-red' : 'border-line'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200`}
                placeholder="Jean Dupont"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red">{errors.name}</p>
            )}
          </div>

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
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple hover:to-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium mt-6"
          >
            {loading ? (
              <>
                <i className="ph ph-circle-notch animate-spin mr-2 text-xl"></i>
                Création en cours...
              </>
            ) : (
              <>
                <i className="ph-bold ph-user-plus mr-2 text-xl"></i>
                Créer mon compte
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-secondary">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/login"
                className="font-medium text-purple hover:text-blue transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
