import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import FormationCardAnvogue from '../components/FormationCardAnvogue';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { getAllCategories } from '../data/categories';
import { query } from '../lib/db';

export async function getServerSideProps() {
  try {
    // Récupérer les formations populaires (les plus vendues)
    const popularFormations = await query(
      `SELECT
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.price_ttc,
        f.quantity_sold,
        f.created_at,
        f.formation_type,
        u.id as seller_id,
        u.pseudo as seller_name,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      LEFT JOIN reviews r ON f.id = r.formation_id
      WHERE f.is_published = TRUE AND f.is_active = TRUE
      GROUP BY f.id, u.id
      ORDER BY f.quantity_sold DESC, f.created_at DESC
      LIMIT 8`,
      []
    );

    // Récupérer les formations récentes
    const recentFormations = await query(
      `SELECT
        f.id,
        f.title,
        f.description,
        f.category_slug,
        f.price_ttc,
        f.quantity_sold,
        f.created_at,
        f.formation_type,
        u.id as seller_id,
        u.pseudo as seller_name,
        u.prenom as seller_prenom,
        u.nom as seller_nom,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM formations f
      JOIN users u ON f.seller_id = u.id
      LEFT JOIN reviews r ON f.id = r.formation_id
      WHERE f.is_published = TRUE AND f.is_active = TRUE
      GROUP BY f.id, u.id
      ORDER BY f.created_at DESC
      LIMIT 8`,
      []
    );

    // Formater les données
    const formatFormations = (rows) => {
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category_name: row.category_slug,
        price: parseFloat(row.price_ttc),
        promo_price: null,
        is_promo_active: false,
        average_rating: parseFloat(row.average_rating),
        seller_name: row.seller_name || `${row.seller_prenom} ${row.seller_nom}`,
        seller_id: row.seller_id,
        total_sales: row.quantity_sold || 0,
        total_capacity: 100,
        level: 'Tous niveaux',
        is_new: (new Date() - new Date(row.created_at)) < 7 * 24 * 60 * 60 * 1000,
        formation_type: row.formation_type,
        total_reviews: parseInt(row.total_reviews) || 0,
      }));
    };

    // Récupérer les catégories
    const categories = getAllCategories();

    return {
      props: {
        popularFormations: formatFormations(popularFormations.rows),
        recentFormations: formatFormations(recentFormations.rows),
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      props: {
        popularFormations: [],
        recentFormations: [],
        categories: getAllCategories(),
      },
    };
  }
}

export default function HomeAnvogue({ popularFormations, recentFormations, categories }) {

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

        {/* Popular Formations Section */}
        <div className="what-new-block md:pt-28 pt-16 md:pb-16 pb-8">
          <div className="container">
            <div className="heading flex flex-col items-center text-center mb-12">
              <div className="flex items-center gap-3 mb-4">
                <i className="ph-bold ph-fire text-5xl text-orange-500"></i>
                <h2 className="font-display text-4xl md:text-5xl font-bold">Formations Populaires</h2>
              </div>
              <p className="text-base md:text-lg text-secondary leading-relaxed max-w-2xl">Les formations les plus demandées et les mieux notées par notre communauté</p>
            </div>

            {popularFormations.length === 0 ? (
              <div className="text-center py-12">
                <i className="ph-bold ph-books text-9xl text-gray-300 mb-6 block"></i>
                <p className="text-lg text-secondary">Aucune formation disponible pour le moment</p>
              </div>
            ) : (
              <>
                <div className="list-product grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-8 gap-5">
                  {popularFormations.map((formation) => (
                    <FormationCardAnvogue key={formation.id} formation={formation} />
                  ))}
                </div>

                <div className="flex items-center justify-center mt-16">
                  <Link href="/formations" className="button-main text-base px-8 py-4">
                    Voir Toutes les Formations
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Formations Section */}
        {recentFormations.length > 0 && (
          <div className="recent-block md:pt-16 pt-8 md:pb-28 pb-16 bg-surface">
            <div className="container">
              <div className="heading flex flex-col items-center text-center mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <i className="ph-bold ph-sparkle text-5xl text-purple"></i>
                  <h2 className="font-display text-4xl md:text-5xl font-bold">Nouveautés</h2>
                </div>
                <p className="text-base md:text-lg text-secondary leading-relaxed max-w-2xl">Découvrez les dernières formations ajoutées à notre catalogue</p>
              </div>

              <div className="list-product grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-8 gap-5">
                {recentFormations.map((formation) => (
                  <FormationCardAnvogue key={formation.id} formation={formation} />
                ))}
              </div>

              <div className="flex items-center justify-center mt-16">
                <Link href="/formations" className="button-main text-base px-8 py-4">
                  Explorer Plus de Formations
                </Link>
              </div>
            </div>
          </div>
        )}

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
