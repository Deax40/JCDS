import { useRouter } from 'next/router';
import Head from 'next/head';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import SearchBar from '../../components/SearchBar';
import CategoryBackground from '../../components/CategoryBackground';
import { getCategoryBySlug, getAllCategories } from '../../data/categories';
import Link from 'next/link';

export default function CategoryPage({ category }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Chargement...</div>;
  }

  if (!category) {
    return (
      <>
        <HeaderAnvogue />
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Catégorie non trouvée</h1>
          <p className="text-secondary mb-8">Cette catégorie n'existe pas.</p>
          <Link href="/" className="button-main">
            Retour à l'accueil
          </Link>
        </div>
        <FooterAnvogue />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} - FormationPlace</title>
        <meta name="description" content={category.description} />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section avec le thème de la catégorie */}
        <div className="relative w-full md:h-[400px] h-[300px] overflow-hidden">
          <CategoryBackground pattern={category.pattern} gradient={category.gradient} />

          {/* Contenu du hero */}
          <div className="container relative z-10 h-full flex flex-col justify-center items-center text-center text-white">
            <div className="mb-6">
              <i className={`ph-bold ${category.icon} text-white drop-shadow-lg`} style={{ fontSize: '80px' }}></i>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {category.name}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mb-2 drop-shadow-md">
              {category.description}
            </p>
            <p className="text-sm opacity-90">
              <span className="font-semibold">{category.count}</span> formation{category.count > 1 ? 's' : ''} disponible{category.count > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white border-b border-line">
          <div className="container py-8">
            <SearchBar placeholder={`Rechercher dans ${category.name}...`} />
          </div>
        </div>

        {/* Section des formations */}
        <div className="formations-section md:py-20 py-12">
          <div className="container">
            {category.count === 0 ? (
              // État vide - Aucune formation
              <div className="text-center py-20">
                <div className="max-w-lg mx-auto">
                  <i className={`ph-bold ${category.icon} text-9xl text-gray-300 mb-6 block`}></i>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    Aucune formation disponible pour le moment
                  </h2>
                  <p className="text-lg text-secondary mb-8">
                    Cette catégorie est encore vide. Soyez le premier à publier une formation dans <strong>{category.name}</strong> !
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/devenir-formateur" className="button-main">
                      Devenir Formateur
                    </Link>
                    <Link href="/" className="button-white">
                      Retour à l'accueil
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Liste des formations (sera remplie plus tard avec de vraies données)
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold">
                    Toutes les formations
                  </h2>
                  <div className="flex gap-3">
                    <select className="px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none">
                      <option>Les plus récentes</option>
                      <option>Les plus populaires</option>
                      <option>Mieux notées</option>
                      <option>Prix croissant</option>
                      <option>Prix décroissant</option>
                    </select>
                  </div>
                </div>

                {/* Grid des formations - sera rempli avec FormationCardAnvogue */}
                <div className="grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-8 gap-5">
                  {/* Les formations seront affichées ici */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section : Autres catégories */}
        <div className="other-categories-section bg-surface md:py-20 py-12">
          <div className="container">
            <div className="heading flex flex-col items-center text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Découvrez d'autres catégories
              </h2>
              <p className="text-base md:text-lg text-secondary leading-relaxed max-w-2xl">
                Explorez nos autres domaines de formation
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {getAllCategories()
                .filter(cat => cat.slug !== category.slug)
                .slice(0, 6)
                .map((cat, index) => (
                  <Link
                    key={index}
                    href={`/categories/${cat.slug}`}
                    className="group relative overflow-hidden rounded-2xl p-8 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`ph-bold ${cat.icon} text-white text-3xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-purple transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-secondary">
                          {cat.count === 0 ? 'Aucune formation' : `${cat.count} formation${cat.count > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary line-clamp-2">
                      {cat.description}
                    </p>
                  </Link>
                ))}
            </div>

            <div className="flex items-center justify-center mt-12">
              <Link href="/categories" className="button-main">
                Voir Toutes les Catégories
              </Link>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}

// Générer les pages statiques pour toutes les catégories
export async function getStaticPaths() {
  const categories = getAllCategories();

  const paths = categories.map((category) => ({
    params: { slug: category.slug }
  }));

  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      category
    },
    revalidate: 60 // Régénérer la page toutes les 60 secondes
  };
}
