import { useState, useEffect } from 'react';
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
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadPurchases();
  }, [user, router]);

  const loadPurchases = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/purchases/my-purchases?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases || []);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (formationId, formationTitle) => {
    setDownloadingPdf(formationId);
    try {
      const response = await fetch(`/api/purchases/download-pdf?userId=${user.id}&formationId=${formationId}`);
      const data = await response.json();

      if (response.ok && data.url) {
        // Ouvrir l'URL signée dans un nouvel onglet
        window.open(data.url, '_blank');
      } else {
        alert(data.message || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloadingPdf(null);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Mes Achats - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="purchases-page pt-20 pb-20 bg-surface min-h-screen">
          <div className="container mx-auto px-4">
            <h1 className="heading3 mb-10">Mes Achats</h1>

            {loading ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
                <p className="text-secondary">Chargement de vos achats...</p>
              </div>
            ) : purchases.length === 0 ? (
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
                        <h3 className="heading6 mb-2">Achat #{purchase.id}</h3>
                        <p className="text-sm text-secondary">
                          {new Date(purchase.purchasedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary mb-1">Prix payé</p>
                        <p className="font-bold text-lg">{formatPrice(purchase.pricePaid)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-surface rounded-xl">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${purchase.formation.category.gradient} flex items-center justify-center flex-shrink-0`}>
                        <i className={`ph-bold ${purchase.formation.category.icon} text-white text-2xl`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{purchase.formation.title}</h4>
                        <p className="text-sm text-secondary mb-2">{purchase.formation.category.name}</p>
                        <div className="flex items-center gap-2">
                          {purchase.formation.type === 'pdf' && (
                            <span className="text-xs px-2 py-1 bg-red bg-opacity-10 text-red rounded">
                              <i className="ph-bold ph-file-pdf mr-1"></i>
                              PDF
                            </span>
                          )}
                          {purchase.formation.type === 'visio' && (
                            <span className="text-xs px-2 py-1 bg-blue bg-opacity-10 text-blue rounded">
                              <i className="ph-bold ph-video-camera mr-1"></i>
                              Visio
                            </span>
                          )}
                          {purchase.formation.type === 'en_ligne' && (
                            <span className="text-xs px-2 py-1 bg-purple bg-opacity-10 text-purple rounded">
                              <i className="ph-bold ph-video mr-1"></i>
                              En ligne
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bouton d'action selon le type */}
                      {purchase.formation.type === 'pdf' && purchase.formation.pdfPath && (
                        <button
                          onClick={() => handleDownloadPdf(purchase.formation.id, purchase.formation.title)}
                          disabled={downloadingPdf === purchase.formation.id}
                          className="px-6 py-3 bg-red bg-opacity-10 text-red rounded-xl hover:bg-opacity-20 transition font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                          {downloadingPdf === purchase.formation.id ? (
                            <>
                              <i className="ph ph-circle-notch animate-spin"></i>
                              Chargement...
                            </>
                          ) : (
                            <>
                              <i className="ph-bold ph-download-simple"></i>
                              Télécharger PDF
                            </>
                          )}
                        </button>
                      )}

                      {purchase.formation.type === 'visio' && purchase.formation.visioLink && (
                        <a
                          href={purchase.formation.visioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-blue bg-opacity-10 text-blue rounded-xl hover:bg-opacity-20 transition font-semibold flex items-center gap-2"
                        >
                          <i className="ph-bold ph-video-camera"></i>
                          Rejoindre la visio
                        </a>
                      )}

                      {purchase.formation.type === 'en_ligne' && (
                        <Link
                          href={`/formation/${purchase.formation.id}`}
                          className="px-6 py-3 bg-purple bg-opacity-10 text-purple rounded-xl hover:bg-opacity-20 transition font-semibold flex items-center gap-2"
                        >
                          <i className="ph-bold ph-play"></i>
                          Voir la formation
                        </Link>
                      )}
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
