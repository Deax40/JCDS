import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';

export default function MonCompte() {
  const router = useRouter();
  const { user, wishlist, updatePseudo } = useAuth();
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [newPseudo, setNewPseudo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleUpdatePseudo = async () => {
    setError('');
    setSuccess('');

    if (!newPseudo || newPseudo.length < 3) {
      setError('Le pseudo doit contenir au moins 3 caractères');
      return;
    }

    const result = await updatePseudo(newPseudo);
    if (result.success) {
      setSuccess('Pseudo mis à jour avec succès');
      setIsEditingPseudo(false);
      setNewPseudo('');
    } else {
      setError(result.message);
    }
  };

  // Avatar selon le genre
  const avatarIcon = user.genre === 'femme' ? 'ph-user-circle-gear' : 'ph-user-circle';

  return (
    <>
      <Head>
        <title>Mon Compte - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="account-page pt-20 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="heading3 mb-10">Mon Compte</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profil */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow p-8">
                  {/* Avatar et infos principales */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-line">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple to-blue flex items-center justify-center">
                      <i className={`ph-bold ${avatarIcon} text-white text-6xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h2 className="heading5 mb-2">{user.prenom} {user.nom}</h2>
                      <p className="text-secondary mb-1">@{user.pseudo}</p>
                      <p className="text-xs text-secondary">ID: #{user.id}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          user.role === 'vendeur'
                            ? 'bg-purple bg-opacity-10 text-purple'
                            : 'bg-blue bg-opacity-10 text-blue'
                        }`}>
                          {user.role === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-6">
                    <h3 className="heading6 mb-4">Informations personnelles</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-secondary block mb-2">Email</label>
                        <p className="font-medium">{user.email}</p>
                      </div>

                      <div>
                        <label className="text-sm text-secondary block mb-2">Téléphone</label>
                        <p className="font-medium">{user.telephone}</p>
                      </div>

                      <div>
                        <label className="text-sm text-secondary block mb-2">Nom</label>
                        <p className="font-medium">{user.nom}</p>
                      </div>

                      <div>
                        <label className="text-sm text-secondary block mb-2">Prénom</label>
                        <p className="font-medium">{user.prenom}</p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm text-secondary block mb-2">Pseudo (modifiable)</label>
                        {isEditingPseudo ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newPseudo}
                              onChange={(e) => setNewPseudo(e.target.value)}
                              className="flex-1 px-4 py-2 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                              placeholder={user.pseudo}
                            />
                            <button
                              onClick={handleUpdatePseudo}
                              className="px-6 py-2 bg-purple text-white rounded-xl hover:bg-opacity-90 transition"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingPseudo(false);
                                setNewPseudo('');
                                setError('');
                              }}
                              className="px-6 py-2 bg-surface rounded-xl hover:bg-opacity-80 transition"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{user.pseudo}</p>
                            <button
                              onClick={() => setIsEditingPseudo(true)}
                              className="text-sm text-purple hover:underline"
                            >
                              Modifier
                            </button>
                          </div>
                        )}
                        {error && <p className="text-sm text-red mt-2">{error}</p>}
                        {success && <p className="text-sm text-green mt-2">{success}</p>}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-line">
                      <p className="text-sm text-secondary">
                        <i className="ph-bold ph-info mr-2"></i>
                        Pour modifier d'autres informations, veuillez{' '}
                        <Link href="/support" className="text-purple hover:underline">
                          contacter le support
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Statistiques */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="heading6 mb-4">Statistiques</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Achats</span>
                      <span className="font-semibold">{user.purchases?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Favoris</span>
                      <span className="font-semibold">{wishlist?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="heading6 mb-4">Actions rapides</h3>
                  <div className="space-y-3">
                    <Link
                      href="/mes-achats"
                      className="block w-full px-4 py-3 bg-surface rounded-xl hover:bg-opacity-80 transition text-center"
                    >
                      Voir mes achats
                    </Link>
                    <Link
                      href="/favoris"
                      className="block w-full px-4 py-3 bg-surface rounded-xl hover:bg-opacity-80 transition text-center"
                    >
                      Mes favoris
                    </Link>
                    <Link
                      href="/panier"
                      className="block w-full px-4 py-3 bg-surface rounded-xl hover:bg-opacity-80 transition text-center"
                    >
                      Mon panier
                    </Link>
                    <Link
                      href="/support"
                      className="block w-full px-4 py-3 bg-surface rounded-xl hover:bg-opacity-80 transition text-center"
                    >
                      Support
                    </Link>
                  </div>
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
