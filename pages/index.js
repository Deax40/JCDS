import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import FormationCardAnvogue from '../components/FormationCardAnvogue';
import HeroSlider from '../components/HeroSlider';
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

      <div className="overflow-x-hidden bg-white">
        <HeaderAnvogue />

        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Collections Block - Modernized & Improved */}
        <div className="py-16 md:py-24 bg-gradient-to-b from-white to-surface/50">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                 <div className="text-purple font-semibold uppercase tracking-wider text-sm mb-2">Explorer</div>
                 <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Parcourir par Catégorie</h2>
                 <p className="mt-3 text-secondary text-lg">Trouvez la formation qui vous correspond.</p>
              </div>
              <Link href="/categories" className="text-primary font-semibold hover:text-purple transition-colors flex items-center gap-2 group">
                Voir tout <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-purple/5 hover:-translate-y-2 border border-line/50 hover:border-purple/30"
                >
                   {/* Hover Effect Background */}
                   <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 text-3xl relative z-10 ${category.icon.includes('code') ? 'bg-blue/10 text-blue' : category.icon.includes('paint') ? 'bg-purple/10 text-purple' : 'bg-primary/5 text-primary'}`}>
                      <i className={`ph-bold ${category.icon}`}></i>
                   </div>
                   <div className="font-semibold text-primary relative z-10 group-hover:text-purple transition-colors">{category.name}</div>
                   <span className="text-xs text-secondary bg-surface px-3 py-1 rounded-full border border-line group-hover:border-purple/20 transition-colors relative z-10">
                      {category.count || 0} cours
                   </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* What's New / Popular Formations */}
        <div className="py-16 md:py-24 bg-surface/30">
          <div className="container">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                 <div className="text-purple font-semibold uppercase tracking-wider text-sm mb-2">Tendances</div>
                 <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Formations Populaires</h2>
                 <p className="mt-3 text-secondary text-lg">Les cours les plus plébiscités par la communauté.</p>
              </div>
              <Link href="/formations" className="button-white px-6 py-3">
                Voir le catalogue
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {formations.map((formation) => (
                <FormationCardAnvogue key={formation.id} formation={formation} />
              ))}
            </div>
          </div>
        </div>

        {/* Removed "Why Choose Us" Section as per user feedback */}

        <FooterAnvogue />
      </div>
    </>
  );
}
