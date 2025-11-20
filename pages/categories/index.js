import Head from 'next/head';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import SearchBar from '../../components/SearchBar';
import { getAllCategories } from '../../data/categories';
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <>
      <Head>
        <title>Toutes les Catégories - FormationPlace</title>
        <meta name="description" content="Parcourez toutes nos catégories de formations : développement web, business, langues, fitness et plus encore." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple via-blue to-cyan-500 text-white py-20 md:py-28">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Explorez Nos Catégories
              </h1>
              <p className="text-lg md:text-xl mb-8 drop-shadow-md opacity-95">
                Découvrez des formations dans tous les domaines pour développer vos compétences
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar placeholder="Rechercher une catégorie ou une formation..." />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des catégories */}
        <div className="categories-section md:py-20 py-12">
          <div className="container">
            <div className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {categories.length} Catégories Disponibles
              </h2>
              <p className="text-lg text-secondary">
                Choisissez la catégorie qui correspond à vos objectifs d'apprentissage
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl bg-white border-2 border-line hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="flex md:flex-row flex-col">
                    {/* Section gauche : Gradient avec icône */}
                    <div className={`md:w-48 h-48 md:h-auto relative overflow-hidden bg-gradient-to-br ${category.gradient}`}>
                      {/* Icône principale */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className={`ph-bold ${category.icon} text-white opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110`} style={{ fontSize: '100px' }}></i>
                      </div>

                      {/* Icône secondaire */}
                      <div className="absolute bottom-4 right-4">
                        <i className={`ph-bold ${category.secondaryIcon} text-white opacity-30 group-hover:opacity-50 transition-all duration-500 group-hover:rotate-12`} style={{ fontSize: '40px' }}></i>
                      </div>

                      {/* Pattern overlay */}
                      {category.pattern === 'dots' && (
                        <div className="absolute inset-0 opacity-20">
                          <svg width="100%" height="100%">
                            <pattern id={`dots-${index}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                              <circle cx="15" cy="15" r="2" fill="white" />
                            </pattern>
                            <rect x="0" y="0" width="100%" height="100%" fill={`url(#dots-${index})`} />
                          </svg>
                        </div>
                      )}

                      {category.pattern === 'grid' && (
                        <div className="absolute inset-0 opacity-20">
                          <svg width="100%" height="100%">
                            <pattern id={`grid-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                            </pattern>
                            <rect x="0" y="0" width="100%" height="100%" fill={`url(#grid-${index})`} />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Section droite : Contenu */}
                    <div className="flex-1 p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-display text-2xl font-bold group-hover:text-purple transition-colors">
                          {category.name}
                        </h3>
                        <div className="text-sm font-bold bg-purple bg-opacity-10 text-purple px-4 py-2 rounded-full group-hover:bg-purple group-hover:text-white transition-all duration-300">
                          {category.count === 0 ? '0' : `${category.count}+`}
                        </div>
                      </div>

                      <p className="text-secondary mb-6 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="flex items-center text-purple group-hover:text-black transition-colors font-medium">
                        Explorer cette catégorie
                        <i className="ph-bold ph-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section bg-gradient-to-br from-black to-gray-800 text-white md:py-20 py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Vous avez une expertise à partager ?
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Rejoignez notre communauté de formateurs et créez vos propres formations
              </p>
              <Link href="/devenir-formateur" className="inline-block px-10 py-5 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1">
                Devenir Formateur
              </Link>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
