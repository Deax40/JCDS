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

      <div className="overflow-x-hidden bg-[#F8F7FA] relative">
        {/* Fond avec formes géométriques */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple/10 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue/10 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-purple/5 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
        </div>

        <div className="relative z-10">
          <HeaderAnvogue />

          <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white">

                {/* Colonne Gauche - Formulaire */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Bon retour parmi nous !</h1>
                  <p className="text-md text-secondary">Connectez-vous pour continuer votre apprentissage.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {generalError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                      <div className="flex">
                        <div className="py-1"><i className="ph-bold ph-warning-circle text-2xl mr-3"></i></div>
                        <div>
                          <p className="font-bold">Erreur de connexion</p>
                          <p className="text-sm">{generalError}</p>
                        </div>
                      </div>
                    </div>
                  )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              Adresse email
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ph ph-envelope text-gray-400 text-xl"></i>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                placeholder="vous@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Mot de passe
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ph ph-lock text-gray-400 text-xl"></i>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
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
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium text-lg"
          >
            {loading ? (
              <>
                <i className="ph ph-circle-notch animate-spin mr-3 text-2xl"></i>
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <i className="ph-bold ph-sign-in mr-3 text-2xl"></i>
                <span>Se connecter</span>
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center pt-4 text-gray-600">
            <p className="text-sm">
              Vous n'avez pas de compte ?{' '}
              <Link
                href="/register"
                className="font-medium text-purple-600 hover:text-blue-500 transition-colors duration-200 underline"
              >
                Inscrivez-vous gratuitement
              </Link>
            </p>
          </div>
                </form>
              </div>

              {/* Colonne Droite - Image */}
              <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1649877508777-1554357604eb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWQlMjB0ZWNofGVufDB8fDB8fHww')" }}>
                <div className="h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-12 text-center">
                  <h2 className="text-4xl font-bold mb-4">Débloquez votre potentiel</h2>
                  <p className="text-lg max-w-md">
                    Rejoignez des milliers d'apprenants et commencez votre aventure avec FormationPlace.
                  </p>
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
