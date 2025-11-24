import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Favoris() {
  const router = useRouter();
  const { user, wishlist, removeFromWishlist, addToCart } = useAuth();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Mes Favoris - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="wishlist-page pt-20 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="heading3 mb-10">Mes Favoris</h1>

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <i className="ph-bold ph-heart text-6xl text-secondary mb-4"></i>
                <h2 className="heading5 mb-4">Aucun favori</h2>
                <p className="text-secondary mb-6">Ajoutez des formations à vos favoris pour les retrouver facilement</p>
                <Link href="/formations" className="button-main inline-block">
                  Découvrir les formations
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-purple to-blue flex items-center justify-center">
                      <i className="ph-bold ph-book-open text-white text-6xl"></i>
                    </div>
                    <div className="p-6">
                      <h3 className="heading6 mb-2">{item.title}</h3>
                      <p className="text-sm text-secondary mb-4">{item.category_name}</p>
                      <p className="font-semibold text-lg mb-4">{formatPrice(item.promo_price || item.price)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            addToCart(item);
                            alert('Ajouté au panier !');
                          }}
                          className="button-main flex-1 text-center"
                        >
                          Ajouter au panier
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="w-12 h-12 flex items-center justify-center bg-surface rounded-xl hover:bg-opacity-80 transition"
                        >
                          <i className="ph-bold ph-trash text-red"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
