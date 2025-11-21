import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import FormationCardAnvogue from '../components/FormationCardAnvogue';
import HeroModern from '../components/HeroModern';
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

        {/* Modern Hero Section */}
        <HeroModern />

        {/* Collections Block - Modernized */}
        <div className="py-16 md:py-24">
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
                  className="group relative overflow-hidden rounded-2xl bg-surface p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white border border-transparent hover:border-line"
                >
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 text-3xl ${category.icon.includes('code') ? 'text-blue' : category.icon.includes('paint') ? 'text-purple' : 'text-primary'}`}>
                      <i className={`ph-bold ${category.icon}`}></i>
                   </div>
                   <div className="font-semibold text-primary">{category.name}</div>
                   <span className="text-xs text-secondary bg-white px-2 py-1 rounded-full border border-line group-hover:border-purple/30 transition-colors">
                      {category.count || 0} cours
                   </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* What's New / Popular Formations */}
        <div className="py-16 md:py-24 bg-surface/50">
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

        {/* Benefits Section - Modernized */}
        <div className="py-16 md:py-24">
          <div className="container">
            <div className="bg-primary rounded-3xl p-8 md:p-16 relative overflow-hidden text-white">
              {/* Background Patterns */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

              <div className="relative z-10">
                 <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Pourquoi nous choisir ?</h2>
                    <p className="text-white/80 text-lg">Une expérience d'apprentissage conçue pour votre réussite.</p>
                 </div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                       <i className="ph-bold ph-rocket-launch text-5xl mb-4 text-purple"></i>
                       <h3 className="text-xl font-bold mb-2">Accès Immédiat</h3>
                       <p className="text-white/60 text-sm">Commencez à apprendre dès votre inscription.</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                       <i className="ph-bold ph-certificate text-5xl mb-4 text-blue"></i>
                       <h3 className="text-xl font-bold mb-2">Certificats</h3>
                       <p className="text-white/60 text-sm">Validez vos compétences avec un certificat.</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                       <i className="ph-bold ph-users text-5xl mb-4 text-green"></i>
                       <h3 className="text-xl font-bold mb-2">Communauté</h3>
                       <p className="text-white/60 text-sm">Échangez avec d'autres passionnés.</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                       <i className="ph-bold ph-device-mobile text-5xl mb-4 text-orange"></i>
                       <h3 className="text-xl font-bold mb-2">Accessible</h3>
                       <p className="text-white/60 text-sm">Apprenez sur mobile, tablette ou ordinateur.</p>
                    </div>
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
