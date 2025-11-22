import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import Link from 'next/link';

export default function DevenirFormateurPage() {
  return (
    <>
      <Head>
        <title>Devenir Formateur - FormationPlace</title>
        <meta name="description" content="Partagez votre expertise et générez des revenus en créant vos propres formations en ligne." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple via-pink to-orange text-white py-20 md:py-28">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                Devenez Formateur
              </h1>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-md opacity-95">
                Partagez votre expertise avec des milliers d&apos;apprenants et générez des revenus
              </p>
              <Link href="/register" className="inline-block px-10 py-5 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1">
                Commencer Maintenant
              </Link>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="advantages-section md:py-20 py-12">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Pourquoi Devenir Formateur ?
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Rejoignez une communauté de formateurs passionnés et transformez votre savoir en revenus
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {/* Avantage 1 */}
              <div className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-purple to-pink rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-currency-dollar text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">Revenus Passifs</h3>
                <p className="text-secondary leading-relaxed">
                  Créez une formation une fois et générez des revenus récurrents sans limite
                </p>
              </div>

              {/* Avantage 2 */}
              <div className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-blue to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-users-three text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">Large Audience</h3>
                <p className="text-secondary leading-relaxed">
                  Touchez des milliers d&apos;apprenants du monde entier en quelques clics
                </p>
              </div>

              {/* Avantage 3 */}
              <div className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-toolbox text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">Outils Simples</h3>
                <p className="text-secondary leading-relaxed">
                  Plateforme intuitive avec tous les outils nécessaires pour créer et vendre
                </p>
              </div>

              {/* Avantage 4 */}
              <div className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-orange to-yellow rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-rocket-launch text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">Liberté Totale</h3>
                <p className="text-secondary leading-relaxed">
                  Travaillez de n&apos;importe où, à votre rythme, selon vos disponibilités
                </p>
              </div>

              {/* Avantage 5 */}
              <div className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-red to-pink rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-shield-check text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">Support Dédié</h3>
                <p className="text-secondary leading-relaxed">
                  Notre équipe vous accompagne à chaque étape de votre parcours
                </p>
              </div>

              {/* Avantage 6 */}
              <div className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-chart-line-up text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">Analytics Détaillés</h3>
                <p className="text-secondary leading-relaxed">
                  Suivez vos performances et optimisez vos formations en temps réel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="how-it-works-section bg-surface md:py-20 py-12">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Comment Ça Marche ?
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                4 étapes simples pour lancer votre première formation
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {/* Étape 1 */}
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple to-pink rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Créez votre compte formateur</h3>
                    <p className="text-secondary leading-relaxed">
                      Inscrivez-vous gratuitement et activez votre mode formateur en quelques clics
                    </p>
                  </div>
                </div>

                {/* Étape 2 */}
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Créez votre formation</h3>
                    <p className="text-secondary leading-relaxed">
                      Utilisez nos outils simples pour créer du contenu de qualité : vidéos, PDF, quiz, etc.
                    </p>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-green to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Publiez et fixez votre prix</h3>
                    <p className="text-secondary leading-relaxed">
                      Publiez votre formation sur la marketplace et définissez votre prix librement
                    </p>
                  </div>
                </div>

                {/* Étape 4 */}
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange to-yellow rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Gagnez de l&apos;argent</h3>
                    <p className="text-secondary leading-relaxed">
                      Recevez vos paiements automatiquement à chaque vente de votre formation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="cta-section bg-gradient-to-br from-black to-gray-800 text-white md:py-20 py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Prêt à Commencer ?
              </h2>
              <p className="text-xl mb-10 opacity-90">
                Rejoignez des milliers de formateurs qui partagent leur savoir et génèrent des revenus
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/register" className="inline-block px-10 py-5 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1">
                  Créer Mon Compte
                </Link>
                <Link href="/contact" className="inline-block px-10 py-5 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 font-semibold text-lg">
                  Nous Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
