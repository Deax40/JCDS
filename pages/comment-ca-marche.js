import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import Link from 'next/link';

export default function CommentCaMarchePage() {
  return (
    <>
      <Head>
        <title>Comment ça marche - FormationPlace</title>
        <meta name="description" content="Découvrez comment FormationPlace révolutionne l'apprentissage en ligne avec des formations de qualité à prix abordables et 10% de commission seulement." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple via-blue to-cyan-500 text-white py-20 md:py-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-6 py-2 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
                <span className="text-sm font-medium">La plateforme 100% française</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                Comment Ça Marche ?
              </h1>
              <p className="text-xl md:text-2xl mb-10 drop-shadow-md opacity-95 leading-relaxed">
                FormationPlace révolutionne l&apos;apprentissage en ligne avec des formations de qualité à prix abordables et un modèle économique unique
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="#apprenants" className="inline-block px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl hover:-translate-y-1">
                  Je veux apprendre
                </a>
                <a href="#formateurs" className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 font-semibold">
                  Je veux enseigner
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Apprenants */}
        <div id="apprenants" className="apprenants-section md:py-28 py-16 bg-white">
          <div className="container">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue bg-opacity-10 text-blue rounded-full mb-4">
                <i className="ph-bold ph-student text-lg"></i>
                <span className="font-medium">Pour les Apprenants</span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Apprenez Plus, Dépensez Moins
              </h2>
              <p className="text-xl text-secondary leading-relaxed">
                Des formations de qualité professionnelle à des prix accessibles à tous
              </p>
            </div>

            {/* Comparaison Livres vs Formations */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Livres - Ancien modèle */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-red rounded-full flex items-center justify-center shadow-lg">
                  <i className="ph-bold ph-x text-white text-2xl"></i>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-400 rounded-xl flex items-center justify-center">
                    <i className="ph-bold ph-book text-white text-3xl"></i>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-700">Les Livres Traditionnels</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-x-circle text-red text-xl mt-1"></i>
                    <span className="text-secondary">Coûteux (20-50€ par livre en moyenne)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-x-circle text-red text-xl mt-1"></i>
                    <span className="text-secondary">Contenu souvent obsolète rapidement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-x-circle text-red text-xl mt-1"></i>
                    <span className="text-secondary">Approche théorique et distante</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-x-circle text-red text-xl mt-1"></i>
                    <span className="text-secondary">Aucune interaction avec l&apos;auteur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-x-circle text-red text-xl mt-1"></i>
                    <span className="text-secondary">Apprentissage passif et solitaire</span>
                  </li>
                </ul>
              </div>

              {/* Formations - Nouveau modèle */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-green to-emerald-500 text-white shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <i className="ph-bold ph-star text-white text-2xl"></i>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ph-bold ph-video-camera text-white text-3xl"></i>
                  </div>
                  <h3 className="font-display text-2xl font-bold">Les Formations FormationPlace</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-check-circle text-yellow text-xl mt-1"></i>
                    <span className="font-medium">Prix ultra-accessibles (dès 9.99€)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-check-circle text-yellow text-xl mt-1"></i>
                    <span className="font-medium">Contenu vidéo régulièrement mis à jour</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-check-circle text-yellow text-xl mt-1"></i>
                    <span className="font-medium">Approche pratique et concrète</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-check-circle text-yellow text-xl mt-1"></i>
                    <span className="font-medium">Chat direct avec les formateurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ph-fill ph-check-circle text-yellow text-xl mt-1"></i>
                    <span className="font-medium">Communauté active et entraide</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Avantages supplémentaires */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-surface rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple to-pink rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ph-bold ph-infinity text-white text-3xl"></i>
                </div>
                <h4 className="font-bold text-lg mb-2">Accès à Vie</h4>
                <p className="text-sm text-secondary">Une fois achetée, la formation vous appartient pour toujours</p>
              </div>

              <div className="text-center p-6 bg-surface rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ph-bold ph-device-mobile text-white text-3xl"></i>
                </div>
                <h4 className="font-bold text-lg mb-2">Multi-Supports</h4>
                <p className="text-sm text-secondary">Apprenez sur ordinateur, tablette ou smartphone</p>
              </div>

              <div className="text-center p-6 bg-surface rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ph-bold ph-certificate text-white text-3xl"></i>
                </div>
                <h4 className="font-bold text-lg mb-2">Certificats</h4>
                <p className="text-sm text-secondary">Obtenez un certificat reconnu à la fin de votre formation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Formateurs */}
        <div id="formateurs" className="formateurs-section md:py-28 py-16 bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container relative z-10">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 text-white rounded-full mb-4 backdrop-blur-sm">
                <i className="ph-bold ph-chalkboard-teacher text-lg"></i>
                <span className="font-medium">Pour les Formateurs</span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Le Meilleur Endroit Pour Vendre Vos Formations
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Une plateforme 100% française avec le modèle économique le plus avantageux du marché
              </p>
            </div>

            {/* Avantages Formateurs */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* 100% Français */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue to-cyan-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-blue transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <i className="ph-bold ph-flag text-white text-3xl"></i>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">100% Français</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Contrairement à nos concurrents (souvent basés hors d&apos;Europe), FormationPlace est une plateforme entièrement française.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <i className="ph-fill ph-check-circle text-green"></i>
                      Serveurs en France
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-fill ph-check-circle text-green"></i>
                      Support en français
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-fill ph-check-circle text-green"></i>
                      RGPD respecté
                    </li>
                  </ul>
                </div>
              </div>

              {/* 10% Commission */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-green transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-green to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                    <i className="ph-bold ph-percent text-white text-3xl"></i>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">Seulement 10% de Commission</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Modèle économique unique : nous ne prenons que 10% de commission, contre 30-50% chez la concurrence.
                  </p>
                  <div className="p-4 bg-green bg-opacity-10 rounded-xl border border-green">
                    <div className="text-3xl font-bold text-green mb-1">90%</div>
                    <div className="text-sm text-gray-400">de vos ventes vous reviennent</div>
                  </div>
                </div>
              </div>

              {/* Support Réactif */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple to-pink rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-purple transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple to-pink rounded-2xl flex items-center justify-center mb-6">
                    <i className="ph-bold ph-headset text-white text-3xl"></i>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">Support & Conseils</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Notre équipe vous accompagne avec un support réactif et des conseils personnalisés pour réussir.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <i className="ph-fill ph-check-circle text-purple"></i>
                      Réponse sous 24h
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-fill ph-check-circle text-purple"></i>
                      Guides et tutoriels
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-fill ph-check-circle text-purple"></i>
                      Conseils marketing
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats Impressionnantes */}
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white bg-opacity-5 rounded-2xl backdrop-blur-sm border border-white border-opacity-10">
                <div className="text-4xl font-bold text-green mb-2">10%</div>
                <div className="text-sm text-gray-400">Commission</div>
              </div>
              <div className="text-center p-6 bg-white bg-opacity-5 rounded-2xl backdrop-blur-sm border border-white border-opacity-10">
                <div className="text-4xl font-bold text-blue mb-2">100%</div>
                <div className="text-sm text-gray-400">Français</div>
              </div>
              <div className="text-center p-6 bg-white bg-opacity-5 rounded-2xl backdrop-blur-sm border border-white border-opacity-10">
                <div className="text-4xl font-bold text-purple mb-2">24h</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
              <div className="text-center p-6 bg-white bg-opacity-5 rounded-2xl backdrop-blur-sm border border-white border-opacity-10">
                <div className="text-4xl font-bold text-yellow mb-2">∞</div>
                <div className="text-sm text-gray-400">Potentiel</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutoriel Devenir Formateur */}
        <div className="tutorial-section md:py-28 py-16 bg-surface">
          <div className="container">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple bg-opacity-10 text-purple rounded-full mb-4">
                <i className="ph-bold ph-graduation-cap text-lg"></i>
                <span className="font-medium">Tutoriel Simple</span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Comment Devenir Formateur ?
              </h2>
              <p className="text-xl text-secondary leading-relaxed">
                Seulement 4 étapes simples pour commencer à vendre vos formations
              </p>
            </div>

            {/* Steps */}
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Étape 1 */}
              <div className="relative group">
                <div className="flex gap-8 items-start p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple to-pink rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold mb-3">Créez Votre Compte</h3>
                    <p className="text-secondary leading-relaxed mb-4">
                      Inscrivez-vous gratuitement sur FormationPlace. Remplissez vos informations de base et confirmez votre email. C&apos;est rapide et gratuit !
                    </p>
                    <Link href="/register" className="inline-flex items-center gap-2 text-purple font-medium hover:gap-3 transition-all">
                      Créer mon compte
                      <i className="ph-bold ph-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative group">
                <div className="flex gap-8 items-start p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold mb-3">Activez &quot;Devenir Formateur&quot;</h3>
                    <p className="text-secondary leading-relaxed mb-4">
                      Une fois connecté, rendez-vous dans votre profil et cliquez sur le bouton &quot;Devenir Formateur&quot;. Un petit formulaire simple vous sera demandé pour vérifier votre identité.
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-blue bg-opacity-10 rounded-xl border border-blue">
                      <i className="ph-bold ph-info text-blue text-2xl"></i>
                      <div className="text-sm">
                        <strong className="text-blue">À savoir :</strong> Le formulaire prend moins de 5 minutes à remplir
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="relative group">
                <div className="flex gap-8 items-start p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold mb-3">Attendez la Validation (24h max)</h3>
                    <p className="text-secondary leading-relaxed mb-4">
                      Notre service de modération prend en charge votre demande rapidement. Vous recevrez un email de confirmation dans les 24 heures maximum.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <i className="ph-fill ph-clock text-green"></i>
                        Traitement rapide
                      </div>
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <i className="ph-fill ph-shield-check text-green"></i>
                        Vérification sécurisée
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Étape 4 */}
              <div className="relative group">
                <div className="flex gap-8 items-start p-8 bg-gradient-to-br from-yellow to-orange text-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">4</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold mb-3">Publiez et Vendez !</h3>
                    <p className="leading-relaxed mb-4 opacity-95">
                      Une fois validé, vous recevez un email de bienvenue. Vous pouvez maintenant créer et publier vos formations, définir vos prix et commencer à vendre immédiatement !
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                        <i className="ph-bold ph-video-camera"></i> Créer des vidéos
                      </span>
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                        <i className="ph-bold ph-currency-dollar"></i> Définir vos prix
                      </span>
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                        <i className="ph-bold ph-rocket-launch"></i> Publier instantanément
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Visual */}
            <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-purple to-blue text-white rounded-3xl text-center">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm font-bold">
                    1
                  </div>
                  <span className="text-sm">Inscription</span>
                </div>
                <i className="ph-bold ph-arrow-right text-2xl"></i>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm font-bold">
                    2
                  </div>
                  <span className="text-sm">Activation</span>
                </div>
                <i className="ph-bold ph-arrow-right text-2xl"></i>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm font-bold">
                    3
                  </div>
                  <span className="text-sm">Validation 24h</span>
                </div>
                <i className="ph-bold ph-arrow-right text-2xl"></i>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-yellow rounded-full flex items-center justify-center font-bold text-black animate-pulse">
                    4
                  </div>
                  <span className="text-sm font-bold">Vendez !</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="cta-section bg-gradient-to-br from-black to-gray-900 text-white md:py-20 py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Prêt à Commencer ?
              </h2>
              <p className="text-xl mb-10 opacity-90">
                Rejoignez FormationPlace aujourd&apos;hui et transformez votre expertise en revenus
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/register" className="inline-block px-10 py-5 bg-gradient-to-r from-purple to-pink text-white rounded-full hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-2xl">
                  Créer Mon Compte Gratuitement
                </Link>
                <Link href="/contact" className="inline-block px-10 py-5 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-2xl">
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
