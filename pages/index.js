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
          <div className="slider-block style-one bg-linear xl:h-[860px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] w-full">
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
                        <div className="text-sub-display text-secondary2">Nouvelle Saison d'Apprentissage!</div>
                        <div className="text-display md:mt-5 mt-2 text-5xl md:text-7xl font-bold">
                          Développez Vos Compétences
                        </div>
                        <p className="text-lg mt-4 text-secondary max-w-xl">
                          Accédez à des centaines de formations créées par des experts passionnés. Commencez dès aujourd'hui!
                        </p>
                        <Link href="/formations" className="button-main md:mt-8 mt-3">
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
                        <div className="text-sub-display text-secondary2">Promotions Exceptionnelles!</div>
                        <div className="text-display md:mt-5 mt-2 text-5xl md:text-7xl font-bold">
                          Jusqu'à -50%
                        </div>
                        <p className="text-lg mt-4 text-secondary max-w-xl">
                          Profitez de réductions exceptionnelles sur une sélection de formations premium.
                        </p>
                        <Link href="/formations?filter=promo" className="button-main md:mt-8 mt-3">
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
                        <div className="text-sub-display text-secondary2">Partagez Votre Expertise!</div>
                        <div className="text-display md:mt-5 mt-2 text-5xl md:text-7xl font-bold">
                          Devenez Formateur
                        </div>
                        <p className="text-lg mt-4 text-secondary max-w-xl">
                          Créez et vendez vos formations. Rejoignez notre communauté de formateurs experts.
                        </p>
                        <Link href="/devenir-formateur" className="button-main md:mt-8 mt-3">
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
        <div className="collection-block md:pt-20 pt-10">
          <div className="container">
            <div className="heading flex flex-col items-center text-center">
              <div className="heading3">Parcourir par Catégorie</div>
              <div className="text-secondary mt-3">Trouvez la formation qui vous correspond</div>
            </div>
            <div className="list-collection grid lg:grid-cols-6 grid-cols-3 sm:gap-[30px] gap-[16px] md:mt-10 mt-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.slug}`}
                  className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="bg-img aspect-square bg-surface relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-500"></div>
                  </div>
                  <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:py-3 py-1.5 bg-white rounded-xl duration-500 absolute left-1/2 -translate-x-1/2">
                    {category.name}
                  </div>
                  <div className="absolute top-3 right-3 caption1 bg-white text-secondary px-2 py-1 rounded-full">
                    {category.count}+
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* What's New Section with Tabs */}
        <div className="what-new-block md:pt-20 pt-10">
          <div className="container">
            <div className="heading flex flex-col items-center text-center">
              <div className="heading3">Formations Populaires</div>
              <div className="text-secondary mt-3">Découvrez les formations les plus demandées</div>
            </div>

            <div className="list-product grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-[30px] gap-4 md:mt-10 mt-6">
              {formations.map((formation) => (
                <FormationCardAnvogue key={formation.id} formation={formation} />
              ))}
            </div>

            <div className="flex items-center justify-center md:mt-10 mt-6">
              <Link href="/formations" className="button-main">
                Voir Toutes les Formations
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefit-block md:pt-20 pt-10 md:pb-20 pb-10">
          <div className="container">
            <div className="list-benefit grid xl:grid-cols-4 sm:grid-cols-2 gap-[30px]">
              <div className="benefit-item flex flex-col items-center justify-center bg-surface rounded-2xl p-8 text-center group hover:bg-black transition-colors duration-300">
                <i className="ph-bold ph-rocket-launch text-5xl mb-4 group-hover:text-white"></i>
                <div className="heading6 group-hover:text-white">Accès Immédiat</div>
                <div className="caption1 text-secondary mt-2 group-hover:text-gray-300">
                  Commencez à apprendre instantanément après l'achat
                </div>
              </div>
              <div className="benefit-item flex flex-col items-center justify-center bg-surface rounded-2xl p-8 text-center group hover:bg-black transition-colors duration-300">
                <i className="ph-bold ph-certificate text-5xl mb-4 group-hover:text-white"></i>
                <div className="heading6 group-hover:text-white">Certificats</div>
                <div className="caption1 text-secondary mt-2 group-hover:text-gray-300">
                  Obtenez des certificats reconnus à la fin de chaque formation
                </div>
              </div>
              <div className="benefit-item flex flex-col items-center justify-center bg-surface rounded-2xl p-8 text-center group hover:bg-black transition-colors duration-300">
                <i className="ph-bold ph-headset text-5xl mb-4 group-hover:text-white"></i>
                <div className="heading6 group-hover:text-white">Support 24/7</div>
                <div className="caption1 text-secondary mt-2 group-hover:text-gray-300">
                  Assistance disponible à tout moment pour vous aider
                </div>
              </div>
              <div className="benefit-item flex flex-col items-center justify-center bg-surface rounded-2xl p-8 text-center group hover:bg-black transition-colors duration-300">
                <i className="ph-bold ph-shield-check text-5xl mb-4 group-hover:text-white"></i>
                <div className="heading6 group-hover:text-white">Satisfait ou Remboursé</div>
                <div className="caption1 text-secondary mt-2 group-hover:text-gray-300">
                  Garantie de remboursement sous 30 jours
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
