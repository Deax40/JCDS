import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircle, Envelope, Phone, PencilSimple, ShoppingCart, Heart, SignOut } from "@phosphor-icons/react";
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { InfoRow, StatRow, ActionLink } from '../components/AuthComponents';

export default function MonCompte() {
  const router = useRouter();
  const { user, wishlist, updatePseudo, logout } = useAuth();
  const [isEditingPseudo, setIsEditingPseudo] =useState(false);
  const [newPseudo, setNewPseudo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // Affiche un loader ou rien en attendant la redirection
  }

  const handleUpdatePseudo = async () => {
    setError('');
    setSuccess('');
    if (!newPseudo || newPseudo.length < 3) {
      setError('Le pseudo doit contenir au moins 3 caractères.');
      return;
    }
    const result = await updatePseudo(newPseudo);
    if (result.success) {
      setSuccess('Pseudo mis à jour avec succès!');
      setIsEditingPseudo(false);
      setNewPseudo('');
    } else {
      setError(result.message || "Erreur lors de la mise à jour.");
    }
  };

  const avatarIcon = user.genre === 'femme' ? <UserCircle size={80} weight="light" className="text-purple-500" /> : <UserCircle size={80} weight="light" className="text-blue-500" />;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>Mon Espace Compte - FormationPlace</title>
        <meta name="description" content={`Bienvenue sur votre espace personnel, ${user.prenom}. Gérez vos informations et formations.`} />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <HeaderAnvogue />

        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800">
              Bienvenue, <span className="text-purple-600">{user.prenom}</span>!
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Ravis de vous revoir sur votre espace personnel.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Carte Profil */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-6 mb-8">
                  {avatarIcon}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{user.prenom} {user.nom}</h2>
                    <p className="text-gray-500">@{user.pseudo}</p>
                    <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-semibold ${user.role === 'vendeur' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <InfoRow icon={<Envelope />} label="Email" value={user.email} />
                  <InfoRow icon={<Phone />} label="Téléphone" value={user.telephone} />
                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-500 block mb-2">Pseudo (modifiable)</label>
                    {isEditingPseudo ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newPseudo}
                          onChange={(e) => setNewPseudo(e.target.value)}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={user.pseudo}
                        />
                        <div className="flex gap-2">
                          <button onClick={handleUpdatePseudo} className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Valider</button>
                          <button onClick={() => setIsEditingPseudo(false)} className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-gray-800">{user.pseudo}</p>
                        <button onClick={() => setIsEditingPseudo(true)} className="flex items-center text-sm text-purple-600 hover:underline">
                          <PencilSimple className="mr-1" /> Modifier
                        </button>
                      </div>
                    )}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-8">
              {/* Statistiques */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vos Activités</h3>
                <div className="space-y-4">
                  <StatRow icon={<ShoppingCart />} label="Achats effectués" value={user.purchases?.length || 0} />
                  <StatRow icon={<Heart />} label="Formations en favoris" value={wishlist?.length || 0} />
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Actions Rapides</h3>
                <div className="space-y-3">
                  <ActionLink href="/mes-achats" icon={<ShoppingCart />}>Mes Achats</ActionLink>
                  <ActionLink href="/favoris" icon={<Heart />}>Mes Favoris</ActionLink>
                  <ActionLink href="/panier" icon={<ShoppingCart />}>Mon Panier</ActionLink>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold">
                    <SignOut /> Se déconnecter
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>

        <FooterAnvogue />
      </div>
    </>
  );
}
