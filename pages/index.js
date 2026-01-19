import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import FormationCardAnvogue from '../components/FormationCardAnvogue';
import Link from 'next/link';
import { getAllCategories } from '../data/categories';

export default function HomeAnvogue() {
  // Sample formations data
  const formations = [
    {
      id: 1,
      slug: 'formation-react-nextjs',
      title: 'Maîtrisez React et Next.js - Formation Complète',
      cover_image_url: '/assets/formations/react.jpg',
      cover_image_hover: '/assets/formations/react-hover.jpg',
      price: 89.00,
      promo_price: 59.00,
      is_promo_active: true,
      average_rating: 4.5,
      seller_name: 'Jean Dupont',
      category_name: 'Développement Web',
      total_sales: 45,
      total_capacity: 100,
      level: 'Intermédiaire',
      is_new: false,
    },
    {
      id: 2,
      slug: 'formation-nodejs-backend',
      title: 'Node.js et Express - Backend Complet',
      cover_image_url: '/assets/formations/nodejs.jpg',
      cover_image_hover: '/assets/formations/nodejs-hover.jpg',
      price: 79.00,
      promo_price: null,
      is_promo_active: false,
      average_rating: 4.8,
      seller_name: 'Marie Martin',
      category_name: 'Développement Web',
      total_sales: 68,
      total_capacity: 100,
      level: 'Avancé',
      is_new: true,
    },
    {
      id: 3,
      slug: 'formation-design-ui-ux',
      title: 'Design UI/UX avec Figma - De Zéro à Expert',
      cover_image_url: '/assets/formations/design.jpg',
      cover_image_hover: '/assets/formations/design-hover.jpg',
      price: 69.00,
      promo_price: 49.00,
      is_promo_active: true,
      average_rating: 4.6,
      seller_name: 'Sophie Dubois',
      category_name: 'Design',
      total_sales: 32,
      total_capacity: 80,
      level: 'Débutant',
      is_new: false,
    },
    {
      id: 4,
      slug: 'formation-marketing-digital',
      title: 'Marketing Digital & SEO - Stratégies Gagnantes',
      cover_image_url: '/assets/formations/marketing.jpg',
      cover_image_hover: '/assets/formations/marketing-hover.jpg',
      price: 99.00,
      promo_price: 79.00,
      is_promo_active: true,
      average_rating: 4.7,
      seller_name: 'Pierre Laurent',
      category_name: 'Business & Marketing',
      total_sales: 54,
      total_capacity: 100,
      level: 'Intermédiaire',
      is_new: false,
    },
  ];

  // Récupérer les vraies données de catégories
  const categories = getAllCategories();

  return (
    <>
      <Head>
        <title>FormationPlace - Marketplace de Formations en Ligne</title>
        <meta name="description" content="Découvrez des milliers de formations en ligne. Apprenez de nouvelles compétences avec des formateurs experts." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section - Modern & Clean */}
        <div id="header" className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Top right circle */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple/5 rounded-full blur-3xl"></div>
            {/* Bottom left circle */}
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue/5 rounded-full blur-3xl"></div>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
          </div>

          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between py-16 md:py-24 lg:py-32 gap-12 lg:gap-16">

              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-purple/10 mb-6">
                  <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-secondary">Plateforme d'apprentissage en ligne</span>
                </div>

                {/* Main Heading */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  Transformez votre{' '}
                  <span className="bg-gradient-to-r from-purple to-blue bg-clip-text text-transparent">
                    avenir
                  </span>
                  {' '}avec les bonnes compétences
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                  Accédez à des formations de qualité créées par des experts.
                  Apprenez à votre rythme, développez vos compétences et atteignez vos objectifs professionnels.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/formations"
                    className="button-main px-8 py-4 text-base w-full sm:w-auto text-center"
                  >
                    Explorer les formations
                  </Link>
                  <Link
                    href="/devenir-formateur"
                    className="px-8 py-4 text-base font-medium bg-white text-primary rounded-xl hover:shadow-lg transition-all duration-300 border border-line w-full sm:w-auto text-center"
                  >
                    Devenir formateur
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-line/50">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">500+</div>
                    <div className="text-sm text-secondary">Formations</div>
                  </div>
                  <div className="w-px h-12 bg-line/50"></div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">50k+</div>
                    <div className="text-sm text-secondary">Étudiants</div>
                  </div>
                  <div className="w-px h-12 bg-line/50"></div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">4.8/5</div>
                    <div className="text-sm text-secondary">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
                <div className="relative">
                  {/* Main card */}
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-line/20">
                    {/* Icon decorations */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple to-blue rounded-xl flex items-center justify-center">
                        <i className="ph-bold ph-graduation-cap text-white text-2xl"></i>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-purple/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-blue/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-green/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Course preview cards */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-purple/5 rounded-xl">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple to-purple/80 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ph-bold ph-code text-white text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold mb-1 truncate">Développement Web</div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 bg-purple/20 rounded-full flex-1">
                              <div className="h-full bg-purple rounded-full w-3/4"></div>
                            </div>
                            <span className="text-xs text-secondary">75%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-blue/5 rounded-xl">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue to-blue/80 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ph-bold ph-paint-brush text-white text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold mb-1 truncate">Design & Créativité</div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 bg-blue/20 rounded-full flex-1">
                              <div className="h-full bg-blue rounded-full w-1/2"></div>
                            </div>
                            <span className="text-xs text-secondary">50%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-green/5 rounded-xl">
                        <div className="w-14 h-14 bg-gradient-to-br from-green to-green/80 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ph-bold ph-chart-line text-white text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold mb-1 truncate">Business & Marketing</div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 bg-green/20 rounded-full flex-1">
                              <div className="h-full bg-green rounded-full w-2/3"></div>
                            </div>
                            <span className="text-xs text-secondary">65%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom badge */}
                    <div className="mt-8 pt-6 border-t border-line/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="ph-bold ph-check-circle text-green text-xl"></i>
                        <span className="text-sm font-medium">Certificat inclus</span>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple to-blue rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue to-green rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gradient-to-br from-green to-yellow rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium">+50k</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="hidden lg:block absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow to-orange rounded-2xl shadow-xl rotate-12 flex items-center justify-center">
                    <i className="ph-bold ph-star text-white text-4xl -rotate-12"></i>
                  </div>
                  <div className="hidden lg:block absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-pink to-red rounded-full shadow-xl flex items-center justify-center">
                    <i className="ph-bold ph-heart text-white text-2xl"></i>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Collections Block */}
        <div className="collection-block md:pt-28 pt-16 md:pb-16 pb-8">
          <div className="container">
            <div className="heading flex flex-col items-center text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Parcourir par Catégorie</h2>
              <p className="text-base md:text-lg text-secondary leading-relaxed max-w-2xl">Trouvez la formation qui vous correspond parmi nos catégories</p>
            </div>
            <div className="list-collection grid xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 sm:gap-5 gap-3">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.slug}`}
                  className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer group transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="bg-img aspect-square relative overflow-hidden">
                    {/* Gradient de fond avec le thème de la catégorie */}
                    <div className={`w-full h-full bg-gradient-to-br ${category.gradient} group-hover:scale-110 transition-all duration-700 ease-out`}></div>

                    {/* Icône principale */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className={`ph-bold ${category.icon} text-white opacity-30 group-hover:opacity-50 transition-all duration-500`} style={{ fontSize: '48px' }}></i>
                    </div>

                    {/* Icône secondaire en arrière-plan */}
                    <div className="absolute top-2 right-2">
                      <i className={`ph-bold ${category.secondaryIcon} text-white opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:rotate-12`} style={{ fontSize: '24px' }}></i>
                    </div>

                    {/* Overlay gradient au hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-black/0 group-hover:from-white/10 group-hover:to-black/20 transition-all duration-700"></div>
                  </div>

                  <div className="collection-name font-medium text-center bottom-3 w-[85%] py-1.5 px-1 bg-white rounded-lg duration-500 absolute left-1/2 -translate-x-1/2 group-hover:bg-black group-hover:text-white group-hover:scale-105 shadow-md group-hover:shadow-lg text-xs leading-tight">
                    {category.name}
                  </div>

                  <div className="absolute top-2 right-2 text-[10px] font-bold bg-white text-purple px-2 py-1 rounded-full group-hover:bg-purple group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                    {category.count === 0 ? '0' : `${category.count}+`}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* What's New Section with Tabs */}
        <div className="what-new-block md:pt-28 pt-16 md:pb-16 pb-8">
          <div className="container">
            <div className="heading flex flex-col items-center text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Formations Populaires</h2>
              <p className="text-base md:text-lg text-secondary leading-relaxed max-w-2xl">Découvrez les formations les plus demandées par notre communauté</p>
            </div>

            <div className="list-product grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-8 gap-5">
              {formations.map((formation) => (
                <FormationCardAnvogue key={formation.id} formation={formation} />
              ))}
            </div>

            <div className="flex items-center justify-center mt-16">
              <Link href="/formations" className="button-main text-base px-8 py-4">
                Voir Toutes les Formations
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefit-block md:pt-28 pt-16 md:pb-28 pb-16 bg-surface">
          <div className="container">
            <div className="heading flex flex-col items-center text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Pourquoi FormationPlace ?</h2>
              <p className="text-base md:text-lg text-secondary leading-relaxed max-w-2xl">Les avantages qui font la différence</p>
            </div>
            <div className="list-benefit grid xl:grid-cols-4 sm:grid-cols-2 gap-8">
              <div className="benefit-item flex flex-col items-center justify-center bg-white rounded-3xl p-10 text-center group hover:bg-black transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <i className="ph-bold ph-rocket-launch text-6xl mb-6 group-hover:text-white transition-colors"></i>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Accès Immédiat</h3>
                <p className="text-sm leading-relaxed text-secondary group-hover:text-gray-300 transition-colors">
                  Commencez à apprendre instantanément après l'achat
                </p>
              </div>
              <div className="benefit-item flex flex-col items-center justify-center bg-white rounded-3xl p-10 text-center group hover:bg-black transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <i className="ph-bold ph-certificate text-6xl mb-6 group-hover:text-white transition-colors"></i>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Certificats</h3>
                <p className="text-sm leading-relaxed text-secondary group-hover:text-gray-300 transition-colors">
                  Obtenez des certificats reconnus à la fin de chaque formation
                </p>
              </div>
              <div className="benefit-item flex flex-col items-center justify-center bg-white rounded-3xl p-10 text-center group hover:bg-black transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <i className="ph-bold ph-headset text-6xl mb-6 group-hover:text-white transition-colors"></i>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Support 24/7</h3>
                <p className="text-sm leading-relaxed text-secondary group-hover:text-gray-300 transition-colors">
                  Assistance disponible à tout moment pour vous aider
                </p>
              </div>
              <div className="benefit-item flex flex-col items-center justify-center bg-white rounded-3xl p-10 text-center group hover:bg-black transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <i className="ph-bold ph-shield-check text-6xl mb-6 group-hover:text-white transition-colors"></i>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Satisfait ou Remboursé</h3>
                <p className="text-sm leading-relaxed text-secondary group-hover:text-gray-300 transition-colors">
                  Garantie de remboursement sous 30 jours
                </p>
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
