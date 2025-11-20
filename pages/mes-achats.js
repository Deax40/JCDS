import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function MesAchats() {
  const router = useRouter();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const purchases = user.purchases || [];

  return (
    <>
      <Head>
        <title>Mes Achats - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="purchases-page pt-20 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="heading3 mb-10">Mes Achats</h1>

            {purchases.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <i className="ph-bold ph-shopping-cart text-6xl text-secondary mb-4"></i>
                <h2 className="heading5 mb-4">Aucun achat</h2>
                <p className="text-secondary mb-6">Vous n'avez pas encore effectué d'achat</p>
                <Link href="/formations" className="button-main inline-block">
                  Découvrir les formations
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="bg-white rounded-2xl shadow p-6">
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-line">
                      <div>
                        <h3 className="heading6 mb-2">Commande #{purchase.id}</h3>
                        <p className="text-sm text-secondary">
                          {new Date(purchase.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary mb-1">Total</p>
                        <p className="font-bold text-lg">{formatPrice(purchase.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {purchase.formations.map((formation, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-surface rounded-xl">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple to-blue flex items-center justify-center flex-shrink-0">
                            <i className="ph-bold ph-book-open text-white text-2xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{formation.title}</h4>
                            <p className="text-sm text-secondary">{formation.category_name}</p>
                          </div>
                          <p className="font-semibold">{formatPrice(formation.promo_price || formation.price)}</p>
                        </div>
                      ))}
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
