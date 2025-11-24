import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Panier() {
  const router = useRouter();
  const { user, cart, removeFromCart, clearCart, recordPurchase } = useAuth();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const result = recordPurchase(cart);
    if (result.success) {
      alert('Achat effectué avec succès !');
      router.push('/mes-achats');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.promo_price || item.price), 0);

  return (
    <>
      <Head>
        <title>Mon Panier - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="cart-page pt-20 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="heading3 mb-10">Mon Panier</h1>

            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <i className="ph-bold ph-shopping-bag text-6xl text-secondary mb-4"></i>
                <h2 className="heading5 mb-4">Votre panier est vide</h2>
                <p className="text-secondary mb-6">Découvrez nos formations et ajoutez-les à votre panier</p>
                <Link href="/formations" className="button-main inline-block">
                  Découvrir les formations
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Liste des formations */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow p-6 flex gap-6">
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple to-blue flex items-center justify-center flex-shrink-0">
                        <i className="ph-bold ph-book-open text-white text-3xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="heading6 mb-2">{item.title}</h3>
                        <p className="text-sm text-secondary mb-2">{item.category_name}</p>
                        <p className="font-semibold text-lg">{formatPrice(item.promo_price || item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red hover:text-opacity-80 transition"
                      >
                        <i className="ph-bold ph-trash text-xl"></i>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Résumé */}
                <div>
                  <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
                    <h2 className="heading6 mb-6">Résumé</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-secondary">Nombre d'articles</span>
                        <span className="font-semibold">{cart.length}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="button-main w-full mb-3"
                    >
                      Valider l'achat
                    </button>
                    <button
                      onClick={clearCart}
                      className="button-white w-full"
                    >
                      Vider le panier
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
