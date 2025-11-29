import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import { useAuth } from '../../context/AuthContext';

export default function FormateurDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [formations, setFormations] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingFormation, setDeletingFormation] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/formateur/dashboard');
      return;
    }

    if (user && (!user.roles || !user.roles.includes('formateur'))) {
      router.push('/mon-compte');
      return;
    }

    // Charger les données
    loadData();

    // Afficher message de succès si création
    if (router.query.success === 'creation') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      // Retirer le paramètre de l'URL
      router.replace('/formateur/dashboard', undefined, { shallow: true });
    }
  }, [user, router]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Charger formations et stats
      const formationsResponse = await fetch(`/api/formateur/my-formations?sellerId=${user.id}`);
      if (formationsResponse.ok) {
        const data = await formationsResponse.json();
        setFormations(data.formations || []);
        setStats(data.stats);
      }

      // Charger les avis
      const reviewsResponse = await fetch(`/api/formateur/my-reviews?sellerId=${user.id}`);
      if (reviewsResponse.ok) {
        const data = await reviewsResponse.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFormation = async (formationId, formationTitle) => {
    const reason = prompt(`Pourquoi souhaitez-vous supprimer "${formationTitle}" ?\n\n(Cette demande sera examinée par un administrateur)`);

    if (!reason || reason.trim() === '') {
      return; // Annulé ou vide
    }

    setDeletingFormation(formationId);

    try {
      const response = await fetch('/api/formateur/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ formationId, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Demande de suppression envoyée avec succès');
        // Recharger les données
        loadData();
      } else {
        alert(data.message || 'Erreur lors de la demande de suppression');
      }
    } catch (error) {
      console.error('Error requesting deletion:', error);
      alert('Erreur lors de la demande de suppression');
    } finally {
      setDeletingFormation(null);
    }
  };

  if (!user || !user.roles || !user.roles.includes('formateur')) {
    return null;
  }

  // Calculer revenus du mois
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthRevenue = formations
    .filter(f => {
      const date = new Date(f.createdAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, f) => sum + (f.totalRevenue || 0), 0);

  return (
    <>
      <Head>
        <title>Tableau de Bord Formateur - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Header Dashboard */}
        <div className="bg-gradient-to-br from-purple via-pink to-orange text-white py-12">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="heading3 mb-2">Tableau de Bord Formateur</h1>
                <p className="text-white text-opacity-90">
                  Bienvenue {user.prenom} ! Gérez vos formations et suivez vos ventes
                </p>
              </div>
              <i className="ph-bold ph-crown text-6xl opacity-20"></i>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-16 bg-surface min-h-screen">
          <div className="container">
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green bg-opacity-10 border border-green border-opacity-20 rounded-xl text-green flex items-center gap-3">
                <i className="ph-bold ph-check-circle text-2xl"></i>
                <div>
                  <p className="font-semibold">Formation créée avec succès !</p>
                  <p className="text-sm">Votre formation est maintenant en ligne et visible sur la plateforme.</p>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple bg-opacity-10 flex items-center justify-center">
                    <i className="ph-bold ph-book-open text-purple text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Formations</p>
                    <p className="heading5">{stats?.totalFormations || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue bg-opacity-10 flex items-center justify-center">
                    <i className="ph-bold ph-users text-blue text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Étudiants</p>
                    <p className="heading5">{stats?.totalStudents || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green bg-opacity-10 flex items-center justify-center">
                    <i className="ph-bold ph-currency-dollar text-green text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Revenus ce mois</p>
                    <p className="heading5">{monthRevenue.toFixed(2)} €</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow bg-opacity-10 flex items-center justify-center">
                    <i className="ph-bold ph-star text-yellow text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Note moyenne</p>
                    <p className="heading5">
                      {stats?.globalRating > 0 ? stats.globalRating.toFixed(1) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Section principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Bouton Créer Formation */}
                <div className="bg-gradient-to-br from-purple to-blue rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="heading5 mb-2">Créer une nouvelle formation</h2>
                      <p className="text-white text-opacity-90 mb-4">
                        Partagez votre expertise et commencez à gagner de l'argent
                      </p>
                      <Link
                        href="/formateur/create-formation"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple rounded-xl font-semibold hover:bg-opacity-90 transition"
                      >
                        <i className="ph-bold ph-plus-circle text-xl"></i>
                        Créer une formation
                      </Link>
                    </div>
                    <i className="ph-bold ph-graduation-cap text-6xl opacity-20"></i>
                  </div>
                </div>

                {/* Bouton Messages */}
                <Link
                  href="/formateur/messages"
                  className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue bg-opacity-10 flex items-center justify-center">
                        <i className="ph-bold ph-chats text-blue text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="heading6 text-main">Messagerie</h3>
                        <p className="text-sm text-secondary">
                          Conversations avec vos acheteurs
                        </p>
                      </div>
                    </div>
                    <i className="ph-bold ph-arrow-right text-2xl text-secondary"></i>
                  </div>
                </Link>

                {/* Liste des formations */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading6">Mes Formations ({formations.length})</h2>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <i className="ph ph-circle-notch animate-spin text-purple text-4xl mb-4"></i>
                      <p className="text-secondary">Chargement...</p>
                    </div>
                  ) : formations.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="ph-bold ph-book-open text-6xl text-secondary mb-4"></i>
                      <p className="text-secondary mb-4">Vous n'avez pas encore de formation</p>
                      <Link
                        href="/formateur/create-formation"
                        className="text-purple hover:underline font-semibold"
                      >
                        Créer votre première formation
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formations.map((formation) => (
                        <div
                          key={formation.id}
                          className="p-4 border border-line rounded-xl hover:shadow-md transition group relative"
                        >
                          {/* Badge de suppression en attente */}
                          {formation.deletionRequested && (
                            <div className="absolute top-2 right-2 px-3 py-1 bg-orange bg-opacity-10 text-orange text-xs font-bold rounded-full border border-orange border-opacity-20">
                              <i className="ph-bold ph-hourglass mr-1"></i>
                              Suppression en attente
                            </div>
                          )}

                          <Link href={`/formation/${formation.id}`} className="flex gap-4 cursor-pointer">
                            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${formation.category.gradient} flex items-center justify-center flex-shrink-0`}>
                              <i className={`ph-bold ${formation.category.icon} text-white text-2xl`}></i>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold mb-1 group-hover:text-purple transition">{formation.title}</h3>
                                  <p className="text-xs text-secondary">{formation.category.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {formation.formationType === 'visio' && (
                                    <span className="text-xs px-2 py-1 bg-blue bg-opacity-10 text-blue rounded">
                                      <i className="ph-bold ph-video-camera mr-1"></i>
                                      Visio
                                    </span>
                                  )}
                                  {formation.formationType === 'pdf' && (
                                    <span className="text-xs px-2 py-1 bg-red bg-opacity-10 text-red rounded">
                                      <i className="ph-bold ph-file-pdf mr-1"></i>
                                      PDF
                                    </span>
                                  )}
                                  {formation.formationType === 'en_ligne' && (
                                    <span className="text-xs px-2 py-1 bg-purple bg-opacity-10 text-purple rounded">
                                      <i className="ph-bold ph-video mr-1"></i>
                                      En ligne
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-secondary">
                                  <i className="ph-bold ph-users text-blue mr-1"></i>
                                  {formation.totalSales} ventes
                                </span>
                                <span className="text-secondary">
                                  <i className="ph-bold ph-currency-euro text-green mr-1"></i>
                                  {formation.priceNet.toFixed(2)} € NET
                                </span>
                                <span className="text-secondary">
                                  <i className="ph-bold ph-star text-yellow mr-1"></i>
                                  {formation.averageRating > 0 ? formation.averageRating.toFixed(1) : '-'}
                                </span>
                              </div>

                              {formation.hasQuantityLimit && (
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-orange h-full"
                                      style={{
                                        width: `${(formation.quantitySold / formation.quantityLimit) * 100}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-secondary">
                                    {formation.quantitySold}/{formation.quantityLimit}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Bouton de suppression */}
                          {!formation.deletionRequested && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteFormation(formation.id, formation.title);
                              }}
                              disabled={deletingFormation === formation.id}
                              className="absolute bottom-4 right-4 p-2 bg-red bg-opacity-10 text-red rounded-lg hover:bg-opacity-20 transition disabled:opacity-50 group/delete"
                              title="Demander la suppression"
                            >
                              {deletingFormation === formation.id ? (
                                <i className="ph ph-circle-notch animate-spin text-lg"></i>
                              ) : (
                                <i className="ph-bold ph-trash text-lg group-hover/delete:scale-110 transition-transform"></i>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Avis */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="heading6 mb-4 flex items-center">
                    <i className="ph-bold ph-star text-yellow mr-2"></i>
                    Derniers Avis ({reviews.length})
                  </h3>

                  {reviews.length === 0 ? (
                    <p className="text-sm text-secondary text-center py-4">
                      Aucun avis pour le moment
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {reviews.slice(0, 10).map((review) => (
                        <div key={review.id} className="pb-4 border-b border-line last:border-0 last:pb-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-blue flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {review.buyer.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{review.buyer.pseudo}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`ph-fill ph-star text-sm ${
                                      i < review.rating ? 'text-yellow' : 'text-surface'
                                    }`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>

                          {review.comment && (
                            <p className="text-sm text-secondary line-clamp-2">{review.comment}</p>
                          )}

                          <p className="text-xs text-secondary mt-2">
                            {review.formation.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats revenus */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="heading6 mb-4 flex items-center">
                    <i className="ph-bold ph-wallet text-green mr-2"></i>
                    Revenus Totaux
                  </h3>

                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-green mb-1">
                      {(stats?.totalRevenue || 0).toFixed(2)} €
                    </p>
                    <p className="text-xs text-secondary">NET (après taxes)</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Ce mois:</span>
                      <span className="font-semibold">{monthRevenue.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Nombre d'avis:</span>
                      <span className="font-semibold">{stats?.totalReviews || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="heading6 mb-4">Actions rapides</h3>
                  <div className="space-y-2">
                    <Link
                      href="/formateur/create-formation"
                      className="block w-full px-4 py-2 bg-purple bg-opacity-10 text-purple rounded-lg hover:bg-opacity-20 transition text-center text-sm font-semibold"
                    >
                      <i className="ph-bold ph-plus mr-2"></i>
                      Nouvelle formation
                    </Link>
                    <Link
                      href="/formateur/edit-profile"
                      className="block w-full px-4 py-2 bg-blue bg-opacity-10 text-blue rounded-lg hover:bg-opacity-20 transition text-center text-sm font-semibold"
                    >
                      <i className="ph-bold ph-user-circle mr-2"></i>
                      Modifier mon profil public
                    </Link>
                    <Link
                      href="/mon-compte"
                      className="block w-full px-4 py-2 bg-surface rounded-lg hover:bg-opacity-80 transition text-center text-sm"
                    >
                      Mon compte
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
