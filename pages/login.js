import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <>
      <Head>
        <title>Connexion - FormationPlace</title>
        <meta name="description" content="Connectez-vous à votre compte FormationPlace pour accéder à vos formations." />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden">

          {/* Left Side */}
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-purple to-blue text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center">
              <Link href="/">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">FormationPlace</h1>
              </Link>
              <motion.p variants={itemVariants} className="text-lg md:text-xl max-w-sm">
                Bienvenue de retour ! Connectez-vous pour continuer votre parcours d&apos;apprentissage.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <motion.div
                className="text-center mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-2">Connectez-vous</motion.h2>
                <motion.p variants={itemVariants} className="text-gray-500">Accédez à votre espace personnel.</motion.p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {generalError && (
                  <motion.div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <i className="ph-bold ph-warning-circle mr-2 text-lg"></i>
                    {generalError}
                  </motion.div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="ph ph-envelope text-gray-400 text-xl"></i>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      placeholder="vous@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="ph ph-lock text-gray-400 text-xl"></i>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/support"
                    className="text-sm text-purple hover:text-blue transition-colors duration-200 font-medium"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-purple to-blue hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <>
                      <i className="ph ph-circle-notch animate-spin mr-2 text-xl"></i>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <i className="ph-bold ph-sign-in mr-2 text-xl"></i>
                      Se connecter
                    </>
                  )}
                </motion.button>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Pas encore de compte ?{' '}
                    <Link
                      href="/register"
                      className="font-medium text-purple hover:text-blue transition-colors duration-200"
                    >
                      Inscrivez-vous
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
