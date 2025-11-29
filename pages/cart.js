import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import UserAvatar from '../components/UserAvatar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
        setTotal(parseFloat(data.total) || 0);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (formationId) => {
    setRemoving(formationId);
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId }),
      });

      if (response.ok) {
        loadCart(); // Reload cart
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors du retrait');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Erreur lors du retrait');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Mon Panier - FormationPlace</title>
        </Head>
        <div className="overflow-x-hidden">
          <HeaderAnvogue />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
              <p className="text-secondary">Chargement du panier...</p>
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
        <title>Mon Panier - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="bg-surface min-h-screen py-12 md:py-20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="heading2 mb-2">Mon Panier</h1>
                <p className="text-secondary">
                  {cartItems.length} formation{cartItems.length > 1 ? 's' : ''} dans votre panier
                </p>
              </div>

              {cartItems.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-2xl p-12 text-center shadow">
                  <i className="ph-bold ph-shopping-cart text-9xl text-gray-300 mb-6 block"></i>
                  <h2 className="heading4 mb-4">Votre panier est vide</h2>
                  <p className="text-secondary mb-8">
                    Découvrez nos formations et commencez votre apprentissage
                  </p>
                  <Link href="/formations" className="button-main">
                    Découvrir les formations
                  </Link>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-2 space-y-5">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                      >
                        <div className="flex gap-6">
                          {/* Formation Thumbnail */}
                          <Link href={`/formation/${item.formation.id}`} className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple via-pink to-orange flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                              <i className="ph-bold ph-book-open text-white text-4xl opacity-40"></i>
                            </div>
                          </Link>

                          <div className="flex-1 min-w-0">
                            {/* Category Badge */}
                            <div className="mb-2">
                              <span className="inline-block px-2.5 py-1 bg-purple bg-opacity-10 text-purple text-xs font-bold rounded-full uppercase tracking-wide">
                                {item.formation.categorySlug}
                              </span>
                            </div>

                            <Link
                              href={`/formation/${item.formation.id}`}
                              className="block group/title"
                            >
                              <h3 className="text-lg font-bold mb-2 group-hover/title:text-purple transition line-clamp-1">
                                {item.formation.title}
                              </h3>
                            </Link>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                              {item.formation.description}
                            </p>

                            {/* Seller */}
                            <Link
                              href={`/formateur/${item.formation.seller.id}`}
                              className="flex items-center gap-2 mb-3 hover:text-purple transition group/seller"
                            >
                              <UserAvatar
                                user={{
                                  firstName: item.formation.seller.firstName,
                                  lastName: item.formation.seller.lastName,
                                  pseudo: item.formation.seller.pseudo,
                                  avatar: item.formation.seller.avatar,
                                  avatarColor: item.formation.seller.avatarColor,
                                  avatarShape: item.formation.seller.avatarShape,
                                }}
                                size="sm"
                              />
                              <span className="text-sm font-semibold group-hover/seller:underline">
                                {item.formation.seller.pseudo}
                              </span>
                            </Link>

                            {/* Rating */}
                            {item.formation.averageRating > 0 && (
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`ph-fill ph-star text-sm ${
                                        i < Math.round(item.formation.averageRating)
                                          ? 'text-yellow'
                                          : 'text-gray-300'
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  {item.formation.averageRating.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({item.formation.totalReviews} avis)
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            <button
                              onClick={() => handleRemove(item.formation.id)}
                              disabled={removing === item.formation.id}
                              className="text-sm text-red hover:text-red-600 font-semibold transition flex items-center gap-1.5 group/remove"
                            >
                              <i className="ph-bold ph-trash text-base group-hover/remove:scale-110 transition-transform"></i>
                              {removing === item.formation.id ? 'Retrait en cours...' : 'Retirer du panier'}
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            {item.formation.priceTTC === 0 ? (
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green bg-opacity-10 text-green rounded-lg font-bold">
                                <i className="ph-bold ph-gift text-lg"></i>
                                GRATUIT
                              </div>
                            ) : (
                              <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-3xl font-bold text-purple">
                                    {item.formation.priceTTC.toFixed(2)}
                                  </span>
                                  <span className="text-xl font-semibold text-gray-500">€</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">TTC</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-7 shadow-lg border border-gray-100 sticky top-24">
                      <div className="flex items-center gap-2 mb-6">
                        <i className="ph-bold ph-receipt text-purple text-2xl"></i>
                        <h3 className="text-xl font-bold">Récapitulatif</h3>
                      </div>

                      {/* Items Count */}
                      <div className="mb-6 p-4 bg-gradient-to-br from-purple/5 to-pink/5 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Articles</span>
                          <span className="text-lg font-bold text-purple">
                            {cartItems.length} formation{cartItems.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Sous-total</span>
                          <span className="text-base font-semibold text-gray-800">
                            {total.toFixed(2)} €
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">TVA incluse (20%)</span>
                          <span className="text-base font-semibold text-gray-800">
                            {(total * 0.2 / 1.2).toFixed(2)} €
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="mb-6 p-5 bg-gradient-to-br from-purple to-pink rounded-xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white text-sm mb-1 opacity-90">Total à payer</p>
                            <p className="text-white text-3xl font-bold">
                              {total.toFixed(2)} €
                            </p>
                          </div>
                          <i className="ph-bold ph-currency-eur text-white text-5xl opacity-20"></i>
                        </div>
                      </div>

                      {/* Payment Button */}
                      <button className="w-full bg-gradient-to-r from-purple to-pink text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 mb-3 flex items-center justify-center gap-2">
                        <i className="ph-bold ph-credit-card text-xl"></i>
                        <span>Procéder au paiement</span>
                      </button>

                      {/* Continue Shopping */}
                      <Link
                        href="/formations"
                        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <i className="ph-bold ph-arrow-left"></i>
                        <span>Continuer les achats</span>
                      </Link>

                      {/* Trust Badges */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green/5 rounded-lg border border-green/20">
                          <i className="ph-bold ph-shield-check text-green text-2xl"></i>
                          <div>
                            <p className="text-sm font-bold text-green">Paiement 100% sécurisé</p>
                            <p className="text-xs text-gray-600">
                              Cryptage SSL & 3D Secure
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <i className="ph-bold ph-clock-countdown text-blue-600 text-2xl"></i>
                          <div>
                            <p className="text-sm font-bold text-blue-600">Accès immédiat</p>
                            <p className="text-xs text-gray-600">
                              Commencez dès maintenant
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple/5 rounded-lg border border-purple/20">
                          <i className="ph-bold ph-infinity text-purple text-2xl"></i>
                          <div>
                            <p className="text-sm font-bold text-purple">Accès à vie</p>
                            <p className="text-xs text-gray-600">
                              Sans limite de temps
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
