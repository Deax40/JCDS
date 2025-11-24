import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import SearchBar from '../components/SearchBar';
import FormationCardAnvogue from '../components/FormationCardAnvogue';
import { useState } from 'react';
import { getAllCategories } from '../data/categories';
import Link from 'next/link';

export default function FormationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = getAllCategories();

  // Formations d'exemple (vide pour l'instant)
  const formations = [];

  return (
    <>
      <Head>
        <title>Toutes les Formations - FormationPlace</title>
        <meta name="description" content="Découvrez toutes nos formations en ligne. Des milliers de cours dans tous les domaines." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-black to-gray-800 text-white py-16 md:py-20">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Explorez Nos Formations
              </h1>
              <p className="text-lg md:text-xl mb-8 drop-shadow-md opacity-95">
                {formations.length} formation{formations.length > 1 ? 's' : ''} disponible{formations.length > 1 ? 's' : ''}
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar placeholder="Rechercher une formation..." />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-surface border-b border-line">
          <div className="container py-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Filtres par catégorie */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-black text-white'
                      : 'bg-white border border-line hover:border-purple'
                  }`}
                >
                  Toutes
                </button>
                {categories.map((cat, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-black text-white'
                        : 'bg-white border border-line hover:border-purple'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none bg-white"
              >
                <option value="recent">Les plus récentes</option>
                <option value="popular">Les plus populaires</option>
                <option value="rating">Mieux notées</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="formations-section md:py-20 py-12">
          <div className="container">
            {formations.length === 0 ? (
              // État vide
              <div className="text-center py-20">
                <div className="max-w-lg mx-auto">
                  <i className="ph-bold ph-books text-9xl text-gray-300 mb-6 block"></i>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    Aucune formation disponible pour le moment
                  </h2>
                  <p className="text-lg text-secondary mb-8">
                    Les formations seront bientôt disponibles. Soyez le premier à publier une formation !
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
              // Grid des formations
              <div className="grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-8 gap-5">
                {formations.map((formation) => (
                  <FormationCardAnvogue key={formation.id} formation={formation} />
                ))}
              </div>
            )}
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
