import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';

/**
 * Account Page
 *
 * Page de gestion du compte utilisateur
 *
 * Fonctionnalités:
 * - Afficher les informations du compte
 * - Activer/désactiver le rôle vendeur
 * - Accéder à l'espace vendeur si le rôle est actif
 */
export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(false);

  // TODO: Récupérer l'utilisateur depuis la session/contexte
  // Pour l'instant, utiliser des données fictives
  useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      setUser({
        id: 1,
        email: 'user@example.com',
        name: 'Jean Dupont',
        roles: ['buyer'], // ou ['buyer', 'seller']
      });
      setLoading(false);
    }, 500);
  }, []);

  const hasSellerRole = user?.roles?.includes('seller');

  const handleToggleSellerRole = async () => {
    if (!user) return;

    setUpdatingRole(true);

    try {
      const action = hasSellerRole ? 'remove_seller' : 'add_seller';

      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          action,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Mettre à jour l'état local
        setUser(prev => ({
          ...prev,
          roles: data.roles,
        }));

        alert(data.message);
      } else {
        alert(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du rôle');
    } finally {
      setUpdatingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ph ph-circle-notch animate-spin text-purple text-5xl"></i>
      </div>
    );
  }

  if (!user) {
    // Rediriger vers login si pas connecté
    router.push('/login');
    return null;
  }

  return (
    <>
      <Head>
        <title>Mon Compte - FormationPlace</title>
      </Head>

      <HeaderAnvogue />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading3 mb-2">Mon Compte</h1>
            <p className="text-secondary">Gérez votre profil et vos préférences</p>
          </div>

          {/* Account Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple to-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="heading5 mb-1">{user.name}</h2>
                <p className="text-secondary mb-4">{user.email}</p>
                <div className="flex gap-2">
                  {user.roles.map(role => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-surface text-primary rounded-full text-sm font-medium"
                    >
                      {role === 'buyer' ? '🛒 Acheteur' : '💼 Vendeur'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Role Toggle */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ph-bold ph-storefront text-purple text-2xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="heading6 mb-2">Mode Vendeur</h3>
                {!hasSellerRole ? (
                  <>
                    <p className="text-secondary text-sm mb-4">
                      Activez le mode vendeur pour créer et vendre vos propres formations sur FormationPlace.
                    </p>
                    <button
                      onClick={handleToggleSellerRole}
                      disabled={updatingRole}
                      className="px-6 py-3 bg-gradient-to-r from-purple to-blue text-white rounded-xl font-medium hover:from-purple hover:to-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none inline-flex items-center"
                    >
                      {updatingRole ? (
                        <>
                          <i className="ph ph-circle-notch animate-spin mr-2 text-xl"></i>
                          Activation...
                        </>
                      ) : (
                        <>
                          <i className="ph-bold ph-rocket-launch mr-2 text-xl"></i>
                          Devenir vendeur
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-green text-sm mb-4 flex items-center">
                      <i className="ph-bold ph-check-circle mr-2"></i>
                      Le mode vendeur est activé
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/seller/dashboard"
                        className="px-6 py-3 bg-gradient-to-r from-purple to-blue text-white rounded-xl font-medium hover:from-purple hover:to-purple transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                      >
                        <i className="ph-bold ph-presentation mr-2 text-xl"></i>
                        Espace vendeur
                      </Link>
                      <button
                        onClick={handleToggleSellerRole}
                        disabled={updatingRole}
                        className="px-6 py-3 border border-line text-primary rounded-xl font-medium hover:bg-surface transition-all duration-200 inline-flex items-center"
                      >
                        {updatingRole ? (
                          <>
                            <i className="ph ph-circle-notch animate-spin mr-2 text-xl"></i>
                            Désactivation...
                          </>
                        ) : (
                          <>
                            <i className="ph-bold ph-x-circle mr-2 text-xl"></i>
                            Désactiver le mode vendeur
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/formations"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-blue bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-book-open text-blue text-2xl"></i>
              </div>
              <h3 className="heading6 mb-1">Mes Formations</h3>
              <p className="text-secondary text-sm">Voir mes formations achetées</p>
            </Link>

            <Link
              href="/favorites"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-red bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-heart text-red text-2xl"></i>
              </div>
              <h3 className="heading6 mb-1">Favoris</h3>
              <p className="text-secondary text-sm">Formations sauvegardées</p>
            </Link>

            <Link
              href="/orders"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 bg-green bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-shopping-bag text-green text-2xl"></i>
              </div>
              <h3 className="heading6 mb-1">Commandes</h3>
              <p className="text-secondary text-sm">Historique des achats</p>
            </Link>
          </div>
        </div>
      </div>

      <FooterAnvogue />
    </>
  );
}
