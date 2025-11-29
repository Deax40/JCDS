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
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <Link href={`/formation/${favorite.formation.id}`} className="block relative">
                        {/* Image placeholder with gradient */}
                        <div className="h-52 bg-gradient-to-br from-purple via-pink to-orange flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <i className="ph-bold ph-book-open text-white text-6xl opacity-40 transform group-hover:scale-110 transition-transform duration-300"></i>

                          {/* Free Badge */}
                          {favorite.formation.priceTTC === 0 && (
                            <div className="absolute top-3 left-3 px-3 py-1.5 bg-green text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                              <i className="ph-bold ph-gift"></i>
                              GRATUIT
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-5">
                        {/* Category */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-purple bg-opacity-10 text-purple text-xs font-bold rounded-full uppercase tracking-wide">
                            {favorite.formation.categorySlug}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/formation/${favorite.formation.id}`}>
                          <h3 className="text-lg font-bold mb-3 hover:text-purple transition line-clamp-2 leading-snug">
                            {favorite.formation.title}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {favorite.formation.description}
                        </p>

                        {/* Seller */}
                        <Link
                          href={`/formateur/${favorite.formation.seller.id}`}
                          className="flex items-center gap-2.5 mb-4 hover:text-purple transition group/seller"
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
                          <span className="text-sm font-semibold group-hover/seller:underline">
                            {favorite.formation.seller.pseudo}
                          </span>
                        </Link>

                        {/* Rating */}
                        {favorite.formation.averageRating > 0 && (
                          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`ph-fill ph-star text-base ${
                                    i < Math.round(favorite.formation.averageRating)
                                      ? 'text-yellow'
                                      : 'text-gray-300'
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {favorite.formation.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mb-4">
                          {favorite.formation.priceTTC === 0 ? (
                            <div className="text-green font-bold text-xl flex items-center gap-2">
                              <i className="ph-bold ph-gift text-2xl"></i>
                              Formation Gratuite
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold text-purple">
                                {favorite.formation.priceTTC.toFixed(2)}
                              </span>
                              <span className="text-xl font-semibold text-gray-500">€</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <FormationActions
                          formationId={favorite.formation.id}
                          priceTTC={favorite.formation.priceTTC}
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
