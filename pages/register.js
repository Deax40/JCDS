import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';

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

  // Validation du formulaire
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

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = register(formData);

      if (result.success) {
        // Inscription réussie - rediriger vers le profil
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
        <title>Inscription - FormationPlace</title>
        <meta name="description" content="Créez votre compte FormationPlace" />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="register-page pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="heading3 mb-3">Créer un compte</h1>
                <p className="text-secondary">Rejoignez FormationPlace et commencez à apprendre</p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Message d'erreur général */}
                  {generalError && (
                    <div className="bg-red bg-opacity-10 border border-red text-red px-4 py-3 rounded-xl text-sm flex items-start">
                      <i className="ph-bold ph-warning-circle mr-2 text-lg flex-shrink-0 mt-0.5"></i>
                      <span>{generalError}</span>
                    </div>
                  )}

                  {/* Email et Téléphone */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                        Adresse email <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-envelope text-secondary text-lg"></i>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full pl-11 pr-4 py-3 border ${
                            errors.email ? 'border-red' : 'border-line'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                          placeholder="vous@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red">{errors.email}</p>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-primary mb-2">
                        Téléphone <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-phone text-secondary text-lg"></i>
                        </div>
                        <input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          required
                          value={formData.telephone}
                          onChange={handleChange}
                          className={`block w-full pl-11 pr-4 py-3 border ${
                            errors.telephone ? 'border-red' : 'border-line'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                      {errors.telephone && (
                        <p className="mt-1 text-xs text-red">{errors.telephone}</p>
                      )}
                    </div>
                  </div>

                  {/* Nom et Prénom */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Nom */}
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-primary mb-2">
                        Nom <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-user text-secondary text-lg"></i>
                        </div>
                        <input
                          id="nom"
                          name="nom"
                          type="text"
                          required
                          value={formData.nom}
                          onChange={handleChange}
                          className={`block w-full pl-11 pr-4 py-3 border ${
                            errors.nom ? 'border-red' : 'border-line'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                          placeholder="Dupont"
                        />
                      </div>
                      {errors.nom && (
                        <p className="mt-1 text-xs text-red">{errors.nom}</p>
                      )}
                    </div>

                    {/* Prénom */}
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-primary mb-2">
                        Prénom <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-user text-secondary text-lg"></i>
                        </div>
                        <input
                          id="prenom"
                          name="prenom"
                          type="text"
                          required
                          value={formData.prenom}
                          onChange={handleChange}
                          className={`block w-full pl-11 pr-4 py-3 border ${
                            errors.prenom ? 'border-red' : 'border-line'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                          placeholder="Jean"
                        />
                      </div>
                      {errors.prenom && (
                        <p className="mt-1 text-xs text-red">{errors.prenom}</p>
                      )}
                    </div>
                  </div>

                  {/* Pseudo */}
                  <div>
                    <label htmlFor="pseudo" className="block text-sm font-medium text-primary mb-2">
                      Pseudo en ligne <span className="text-red">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="ph ph-at text-secondary text-lg"></i>
                      </div>
                      <input
                        id="pseudo"
                        name="pseudo"
                        type="text"
                        required
                        value={formData.pseudo}
                        onChange={handleChange}
                        className={`block w-full pl-11 pr-4 py-3 border ${
                          errors.pseudo ? 'border-red' : 'border-line'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                        placeholder="jean_dupont"
                      />
                    </div>
                    {errors.pseudo && (
                      <p className="mt-1 text-xs text-red">{errors.pseudo}</p>
                    )}
                    <p className="mt-1 text-xs text-secondary">
                      Lettres, chiffres et underscores uniquement
                    </p>
                  </div>

                  {/* Genre et Rôle */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Genre */}
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium text-primary mb-2">
                        Genre <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-gender-intersex text-secondary text-lg"></i>
                        </div>
                        <select
                          id="genre"
                          name="genre"
                          value={formData.genre}
                          onChange={handleChange}
                          className="block w-full pl-11 pr-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all appearance-none bg-white"
                        >
                          <option value="homme">Homme</option>
                          <option value="femme">Femme</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <i className="ph ph-caret-down text-secondary"></i>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-secondary">
                        Détermine votre avatar de profil
                      </p>
                    </div>

                    {/* Rôle */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-primary mb-2">
                        Type de compte <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-user-circle text-secondary text-lg"></i>
                        </div>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="block w-full pl-11 pr-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all appearance-none bg-white"
                        >
                          <option value="acheteur">Acheteur</option>
                          <option value="vendeur">Vendeur</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <i className="ph ph-caret-down text-secondary"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mots de passe */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Mot de passe */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                        Mot de passe <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-lock text-secondary text-lg"></i>
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-11 pr-4 py-3 border ${
                            errors.password ? 'border-red' : 'border-line'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirmation mot de passe */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                        Confirmer <span className="text-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="ph ph-lock-key text-secondary text-lg"></i>
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-11 pr-4 py-3 border ${
                            errors.confirmPassword ? 'border-red' : 'border-line'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-purple to-blue hover:from-purple hover:to-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg mt-8"
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
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
