import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { At, Phone, User, Lock, UserPlus } from "@phosphor-icons/react";
import Image from 'next/image';
import { InputField } from '../components/AuthComponents';
import { BACKGROUND_IMAGE_URL } from '../lib/constants';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    telephone: '',
    nom: '',
    prenom: '',
    pseudo: '',
    password: '',
    confirmPassword: '',
    genre: 'homme',
    role: 'acheteur'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }

    // Téléphone
    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Le téléphone doit contenir 10 chiffres';
    }

    // Nom
    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    // Prénom
    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Pseudo
    if (!formData.pseudo) {
      newErrors.pseudo = 'Le pseudo est requis';
    } else if (formData.pseudo.length < 3) {
      newErrors.pseudo = 'Le pseudo doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.pseudo)) {
      newErrors.pseudo = 'Le pseudo ne peut contenir que des lettres, chiffres et underscores';
    }

    // Mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        router.push('/mon-compte');
      } else {
        setGeneralError(result.message || 'Une erreur est survenue lors de l\'inscription');
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
        <title>Inscription - FormationPlace</title>
        <meta name="description" content="Créez votre compte pour accéder à des milliers de formations." />
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden py-12">
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
          className="relative z-10 max-w-2xl w-full mx-4"
        >
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">Créer un Compte</h1>
              <p className="text-gray-600 mt-2">Rejoignez-nous et commencez à apprendre</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {generalError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
                  {generalError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={<User />} name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} error={errors.nom} />
                <InputField icon={<User />} name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />
                <InputField icon={<At />} name="email" type="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField icon={<Phone />} name="telephone" type="tel" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
                <InputField icon={<UserPlus />} name="pseudo" placeholder="Pseudo" value={formData.pseudo} onChange={handleChange} error={errors.pseudo} />

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" />
                    </div>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                </div>

                <InputField icon={<Lock />} name="password" type="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} error={errors.password} />
                <InputField icon={<Lock />} name="confirmPassword" type="password" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Création en cours...' : (
                  <>
                    <UserPlus size={20} className="mr-2" />
                    Créer mon compte
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" passHref>
                <a className="font-medium text-purple-600 hover:text-purple-800">
                  Connectez-vous
                </a>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
