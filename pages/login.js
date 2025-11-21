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

      <div className="min-h-screen flex flex-col bg-white">
        <HeaderAnvogue />

        <div className="flex-grow flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20">
            <div className="w-full max-w-[480px]">
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-primary mb-3 font-display">Bon retour !</h1>
                <p className="text-secondary text-lg">
                  Entrez vos coordonnées pour accéder à votre espace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message d'erreur général */}
                {generalError && (
                  <div className="bg-red/10 border border-red/20 text-red px-4 py-4 rounded-xl flex items-start gap-3">
                    <i className="ph-fill ph-warning-circle text-xl mt-0.5"></i>
                    <span className="font-medium">{generalError}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2 ml-1">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ph ph-envelope text-secondary text-xl group-focus-within:text-purple transition-colors"></i>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-4 bg-surface/50 border ${
                        errors.email ? 'border-red' : 'border-line'
                      } rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple transition-all duration-300 placeholder-secondary2`}
                      placeholder="exemple@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red font-medium flex items-center gap-1 ml-1">
                      <i className="ph-fill ph-warning-circle"></i>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2 ml-1">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ph ph-lock text-secondary text-xl group-focus-within:text-purple transition-colors"></i>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-4 bg-surface/50 border ${
                        errors.password ? 'border-red' : 'border-line'
                      } rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple transition-all duration-300 placeholder-secondary2`}
                      placeholder="Votre mot de passe"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red font-medium flex items-center gap-1 ml-1">
                      <i className="ph-fill ph-warning-circle"></i>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple focus:ring-purple" />
                    <span className="ml-2 text-sm text-secondary">Se souvenir de moi</span>
                  </label>
                  <Link
                    href="/support"
                    className="text-sm font-medium text-purple hover:text-blue transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg shadow-purple/20 text-white bg-gradient-to-r from-purple to-indigo-500 hover:from-purple hover:to-purple hover:shadow-xl hover:shadow-purple/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none font-semibold text-lg"
                >
                  {loading ? (
                    <>
                      <i className="ph ph-circle-notch animate-spin mr-2 text-xl"></i>
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <i className="ph-bold ph-arrow-right ml-2"></i>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-line"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-secondary">Ou continuez avec</span>
                  </div>
                </div>

                {/* Social Login Placeholders (Design only) */}
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center px-4 py-3 border border-line rounded-xl hover:bg-surface transition-colors duration-200 gap-2">
                    <i className="ph-fill ph-google-logo text-xl text-red"></i>
                    <span className="text-sm font-medium text-primary">Google</span>
                  </button>
                  <button type="button" className="flex items-center justify-center px-4 py-3 border border-line rounded-xl hover:bg-surface transition-colors duration-200 gap-2">
                    <i className="ph-fill ph-facebook-logo text-xl text-blue"></i>
                    <span className="text-sm font-medium text-primary">Facebook</span>
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-6">
                  <p className="text-secondary">
                    Vous n'avez pas encore de compte ?{' '}
                    <Link
                      href="/register"
                      className="font-semibold text-purple hover:text-blue transition-colors duration-200"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
              style={{
                backgroundImage: "url('/assets/img/slider/f1.jpg')",
              }}
            ></div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface/20 backdrop-blur-sm flex items-center justify-center text-xs overflow-hidden">
                         {/* Placeholder avatars if needed, or just colored circles */}
                         <div className={`w-full h-full bg-gradient-to-br from-purple/50 to-blue/50`}></div>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium opacity-90">+2000 étudiants nous font confiance</span>
                </div>

                <h2 className="text-4xl font-bold mb-6 font-display leading-tight">
                  "L'éducation est l'arme la plus puissante pour changer le monde."
                </h2>
                <p className="text-lg opacity-80 mb-8 font-light">
                  Rejoignez notre communauté d'apprenants et de formateurs passionnés. Développez vos compétences dès aujourd'hui.
                </p>

                <div className="flex gap-2">
                  <div className="h-1.5 w-12 bg-white rounded-full"></div>
                  <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
                  <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
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
