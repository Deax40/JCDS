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
                  <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="bg-white rounded-xl p-6 shadow hover:shadow-md transition"
                      >
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Link
                              href={`/formation/${item.formation.id}`}
                              className="block group"
                            >
                              <h3 className="heading6 mb-2 group-hover:text-purple transition">
                                {item.formation.title}
                              </h3>
                            </Link>

                            <p className="text-sm text-secondary mb-3 line-clamp-2">
                              {item.formation.description}
                            </p>

                            {/* Seller */}
                            <Link
                              href={`/formateur/${item.formation.seller.id}`}
                              className="flex items-center gap-2 mb-3 hover:text-purple transition"
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
                              <span className="text-sm font-semibold">
                                {item.formation.seller.pseudo}
                              </span>
                            </Link>

                            {/* Rating */}
                            {item.formation.averageRating > 0 && (
                              <div className="flex items-center gap-2 mb-3">
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
                                <span className="text-sm text-secondary">
                                  {item.formation.averageRating.toFixed(1)} ({item.formation.totalReviews} avis)
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            <button
                              onClick={() => handleRemove(item.formation.id)}
                              disabled={removing === item.formation.id}
                              className="text-sm text-red hover:underline"
                            >
                              <i className="ph-bold ph-trash mr-1"></i>
                              {removing === item.formation.id ? 'Retrait...' : 'Retirer'}
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple">
                              {item.formation.priceTTC.toFixed(2)} €
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow sticky top-24">
                      <h3 className="heading5 mb-6">Récapitulatif</h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-secondary">
                          <span>Sous-total</span>
                          <span>{total.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                          <span>TVA (20%)</span>
                          <span>{(total * 0.2).toFixed(2)} €</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-2xl text-purple">
                              {total.toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="button-main w-full mb-3">
                        <i className="ph-bold ph-credit-card mr-2"></i>
                        Procéder au paiement
                      </button>

                      <Link href="/formations" className="button-white w-full block text-center">
                        Continuer les achats
                      </Link>

                      <div className="mt-6 p-4 bg-surface rounded-lg">
                        <div className="flex items-start gap-2">
                          <i className="ph-bold ph-shield-check text-green text-xl"></i>
                          <div>
                            <p className="text-sm font-semibold mb-1">Paiement sécurisé</p>
                            <p className="text-xs text-secondary">
                              Vos informations sont protégées
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
