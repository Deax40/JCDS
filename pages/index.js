import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import FormationCardAnvogue from '../components/FormationCardAnvogue';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

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

  const categories = [
    {
      name: 'Développement Web',
      slug: 'developpement-web',
      image: '/assets/categories/dev-web.jpg',
      count: 245
    },
    {
      name: 'Business & Marketing',
      slug: 'business-marketing',
      image: '/assets/categories/business.jpg',
      count: 128
    },
    {
      name: 'Design',
      slug: 'design',
      image: '/assets/categories/design.jpg',
      count: 89
    },
    {
      name: 'Photographie',
      slug: 'photographie',
      image: '/assets/categories/photo.jpg',
      count: 67
    },
    {
      name: 'Développement Personnel',
      slug: 'developpement-personnel',
      image: '/assets/categories/dev-perso.jpg',
      count: 156
    },
    {
      name: 'Langues',
      slug: 'langues',
      image: '/assets/categories/langues.jpg',
      count: 94
    },
  ];

  return (
    <>
      <Head>
        <title>FormationPlace - Marketplace de Formations en Ligne</title>
        <meta name="description" content="Découvrez des milliers de formations en ligne. Apprenez de nouvelles compétences avec des formateurs experts." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Slider */}
        <div id="header" className="relative w-full">
          <div className="slider-block style-one bg-linear xl:h-[900px] lg:h-[840px] md:h-[640px] sm:h-[540px] h-[420px] w-full">
            <div className="slider-main h-full w-full">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="h-full relative"
              >
                <SwiperSlide>
                  <div className="slider-item h-full w-full relative">
                    <div className="container w-full h-full flex items-center relative">
                      <div className="text-content basis-1/2 z-10">
                        <div className="text-sm md:text-base font-medium text-secondary2 tracking-wider uppercase mb-4">Nouvelle Saison d'Apprentissage</div>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
                          Développez Vos<br />Compétences
                        </h1>
                        <p className="text-base md:text-lg leading-relaxed text-secondary max-w-xl mb-8">
                          Accédez à des centaines de formations créées par des experts passionnés. Commencez dès aujourd'hui!
                        </p>
                        <Link href="/formations" className="button-main">
                          Découvrir les Formations
                        </Link>
                      </div>
                      <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[60px] -right-[16px] bottom-0 opacity-90">
                        <div className="w-full h-full bg-gradient-to-br from-green to-blue rounded-tl-full"></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="slider-item h-full w-full relative">
                    <div className="container w-full h-full flex items-center relative">
                      <div className="text-content basis-1/2 z-10">
                        <div className="text-sm md:text-base font-medium text-secondary2 tracking-wider uppercase mb-4">Promotions Exceptionnelles</div>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
                          Jusqu'à<br />-50%
                        </h1>
                        <p className="text-base md:text-lg leading-relaxed text-secondary max-w-xl mb-8">
                          Profitez de réductions exceptionnelles sur une sélection de formations premium.
                        </p>
                        <Link href="/formations?filter=promo" className="button-main">
                          Voir les Promos
                        </Link>
                      </div>
                      <div className="sub-img absolute w-1/2 2xl:-right-[60px] -right-[0] sm:-bottom-[60px] bottom-0 opacity-90">
                        <div className="w-full h-full bg-gradient-to-br from-red to-orange rounded-tl-full"></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="slider-item h-full w-full relative">
                    <div className="container w-full h-full flex items-center relative">
                      <div className="text-content basis-1/2 z-10">
                        <div className="text-sm md:text-base font-medium text-secondary2 tracking-wider uppercase mb-4">Partagez Votre Expertise</div>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
                          Devenez<br />Formateur
                        </h1>
                        <p className="text-base md:text-lg leading-relaxed text-secondary max-w-xl mb-8">
                          Créez et vendez vos formations. Rejoignez notre communauté de formateurs experts.
                        </p>
                        <Link href="/devenir-formateur" className="button-main">
                          Commencer Maintenant
                        </Link>
                      </div>
                      <div className="sub-img absolute sm:w-1/2 w-2/3 2xl:-right-[60px] -right-[36px] sm:bottom-0 -bottom-[30px] opacity-90">
                        <div className="w-full h-full bg-gradient-to-br from-purple to-pink rounded-tl-full"></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
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
            <div className="list-collection grid lg:grid-cols-6 grid-cols-3 sm:gap-8 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.slug}`}
                  className="collection-item block relative rounded-3xl overflow-hidden cursor-pointer group transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="bg-img aspect-square bg-surface relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-125 transition-all duration-700 ease-out"></div>
                    {/* Overlay gradient au hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/0 to-blue/0 group-hover:from-purple/20 group-hover:to-blue/20 transition-all duration-700"></div>
                  </div>
                  <div className="collection-name font-semibold text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:py-3 py-1.5 bg-white rounded-xl duration-500 absolute left-1/2 -translate-x-1/2 group-hover:bg-black group-hover:text-white group-hover:scale-105 shadow-md group-hover:shadow-xl">
                    {category.name}
                  </div>
                  <div className="absolute top-3 right-3 text-xs font-bold bg-white text-purple px-3 py-1.5 rounded-full group-hover:bg-purple group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                    {category.count}+
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
