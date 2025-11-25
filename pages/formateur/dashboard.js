import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import { useAuth } from '../../context/AuthContext';

export default function FormateurDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Rediriger si non connecté
    if (!user) {
      router.push('/login?redirect=/formateur/dashboard');
      return;
    }

    // Rediriger si pas formateur
    if (user && (!user.roles || !user.roles.includes('formateur'))) {
      router.push('/mon-compte');
    }
  }, [user, router]);

  if (!user || !user.roles || !user.roles.includes('formateur')) {
    return null;
  }

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
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple bg-opacity-10 flex items-center justify-center">
                    <i className="ph-bold ph-book-open text-purple text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Formations</p>
                    <p className="heading5">0</p>
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
                    <p className="heading5">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green bg-opacity-10 flex items-center justify-center">
                    <i className="ph-bold ph-currency-dollar text-green text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Revenus</p>
                    <p className="heading5">0 €</p>
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
                    <p className="heading5">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-wrench text-purple text-4xl"></i>
                </div>

                <h2 className="heading4 mb-4">Tableau de Bord en Construction</h2>
                <p className="text-lg text-secondary mb-8">
                  Cette page est en cours de développement. Vous pourrez bientôt:
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
                  <div className="flex items-start gap-3">
                    <i className="ph-bold ph-check-circle text-green text-xl mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Créer vos formations</p>
                      <p className="text-sm text-secondary">Ajouter des vidéos, PDF, quiz et contenus</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ph-bold ph-check-circle text-green text-xl mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Gérer vos prix</p>
                      <p className="text-sm text-secondary">Définir les tarifs et promotions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ph-bold ph-check-circle text-green text-xl mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Suivre vos ventes</p>
                      <p className="text-sm text-secondary">Analytics et statistiques détaillées</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ph-bold ph-check-circle text-green text-xl mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Recevoir vos paiements</p>
                      <p className="text-sm text-secondary">Gérer vos revenus et retraits</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ph-bold ph-check-circle text-green text-xl mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Communiquer avec les étudiants</p>
                      <p className="text-sm text-secondary">Messages et support élèves</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ph-bold ph-check-circle text-green text-xl mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Voir les avis</p>
                      <p className="text-sm text-secondary">Notes et commentaires des apprenants</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-purple bg-opacity-5 rounded-xl border border-purple border-opacity-20">
                  <p className="text-sm text-secondary">
                    <i className="ph-bold ph-info mr-2"></i>
                    En attendant, vous pouvez explorer la plateforme en tant qu'acheteur et vous familiariser avec l'interface.
                  </p>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                  <Link
                    href="/mon-compte"
                    className="px-6 py-3 bg-gradient-to-r from-purple to-blue text-white rounded-xl font-semibold hover:from-purple hover:to-purple transition"
                  >
                    <i className="ph-bold ph-user-circle mr-2"></i>
                    Retour à mon compte
                  </Link>

                  <Link
                    href="/formations"
                    className="px-6 py-3 bg-surface text-primary rounded-xl font-semibold hover:bg-opacity-80 transition"
                  >
                    <i className="ph-bold ph-compass mr-2"></i>
                    Explorer les formations
                  </Link>
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
