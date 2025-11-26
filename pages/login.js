import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, At, SignIn } from "@phosphor-icons/react";
import Image from 'next/image';
import { BACKGROUND_IMAGE_URL } from '../lib/constants';

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
    if (!formData.email) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'L\'email est invalide';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (!validateForm()) return;
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Head>
        <title>Connexion - FormationPlace</title>
        <meta name="description" content="Connectez-vous à votre compte FormationPlace pour accéder à vos formations et services." />
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
        <Image
          src={BACKGROUND_IMAGE_URL}
          alt="Abstract background"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-md w-full mx-4"
        >
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">Bienvenue</h1>
              <p className="text-gray-600 mt-2">Connectez-vous pour continuer</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {generalError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
                  {generalError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">Adresse email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <At size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 bg-white/50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Adresse email"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 bg-white/50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                    placeholder="Mot de passe"
                  />
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-end">
                <Link href="/support" passHref>
                  <a className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : (
                  <>
                    <SignIn size={20} className="mr-2" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" passHref>
                <a className="font-medium text-purple-600 hover:text-purple-800">
                  Inscrivez-vous
                </a>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
