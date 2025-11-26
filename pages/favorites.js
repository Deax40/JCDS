import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import UserAvatar from '../components/UserAvatar';
import FormationActions from '../components/FormationActions';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Mes Favoris - FormationPlace</title>
        </Head>
        <div className="overflow-x-hidden">
          <HeaderAnvogue />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
              <p className="text-secondary">Chargement des favoris...</p>
            </div>
          </div>
          <FooterAnvogue />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Mes Favoris - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="bg-surface min-h-screen py-12 md:py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="heading2 mb-2">Mes Favoris</h1>
                <p className="text-secondary">
                  {favorites.length} formation{favorites.length > 1 ? 's' : ''} dans vos favoris
                </p>
              </div>

              {favorites.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-2xl p-12 text-center shadow">
                  <i className="ph-bold ph-heart text-9xl text-gray-300 mb-6 block"></i>
                  <h2 className="heading4 mb-4">Aucun favori pour le moment</h2>
                  <p className="text-secondary mb-8">
                    Ajoutez des formations à vos favoris pour les retrouver facilement
                  </p>
                  <Link href="/formations" className="button-main">
                    Découvrir les formations
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.favoriteId}
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <Link href={`/formation/${favorite.formation.id}`} className="block">
                        {/* Image placeholder */}
                        <div className="h-48 bg-gradient-to-br from-purple to-pink flex items-center justify-center">
                          <i className="ph-bold ph-book-open text-white text-6xl opacity-50"></i>
                        </div>
                      </Link>

                      <div className="p-6">
                        {/* Category */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-purple bg-opacity-10 text-purple text-xs font-semibold rounded-full">
                            {favorite.formation.categorySlug}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/formation/${favorite.formation.id}`}>
                          <h3 className="heading6 mb-2 hover:text-purple transition line-clamp-2">
                            {favorite.formation.title}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-secondary mb-4 line-clamp-2">
                          {favorite.formation.description}
                        </p>

                        {/* Seller */}
                        <Link
                          href={`/formateur/${favorite.formation.seller.id}`}
                          className="flex items-center gap-2 mb-4 hover:text-purple transition"
                        >
                          <UserAvatar
                            user={{
                              firstName: favorite.formation.seller.firstName,
                              lastName: favorite.formation.seller.lastName,
                              pseudo: favorite.formation.seller.pseudo,
                              avatar: favorite.formation.seller.avatar,
                              avatarColor: favorite.formation.seller.avatarColor,
                              avatarShape: favorite.formation.seller.avatarShape,
                            }}
                            size="sm"
                          />
                          <span className="text-sm font-semibold">
                            {favorite.formation.seller.pseudo}
                          </span>
                        </Link>

                        {/* Rating */}
                        {favorite.formation.averageRating > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`ph-fill ph-star text-sm ${
                                    i < Math.round(favorite.formation.averageRating)
                                      ? 'text-yellow'
                                      : 'text-gray-300'
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-sm text-secondary">
                              {favorite.formation.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold text-purple">
                              {favorite.formation.priceTTC.toFixed(2)} €
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <FormationActions
                          formationId={favorite.formation.id}
                          onCartUpdate={loadFavorites}
                          onFavoriteUpdate={loadFavorites}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
