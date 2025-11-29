import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import SearchBar from '../components/SearchBar';
import UserAvatar from '../components/UserAvatar';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FormateursPage() {
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFormateurs();
  }, []);

  const loadFormateurs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/formateurs/all');
      if (response.ok) {
        const data = await response.json();
        setFormateurs(data.formateurs || []);
      }
    } catch (error) {
      console.error('Error loading formateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Nos Formateurs - FormationPlace</title>
        <meta name="description" content="Découvrez notre communauté de formateurs experts passionnés par le partage de connaissances." />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple to-pink text-white py-16 md:py-20">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Nos Formateurs Experts
              </h1>
              <p className="text-lg md:text-xl mb-8 drop-shadow-md opacity-95">
                Apprenez des meilleurs dans leur domaine
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar placeholder="Rechercher un formateur..." />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des formateurs */}
        <div className="formateurs-section md:py-20 py-12 bg-surface min-h-screen">
          <div className="container">
            {loading ? (
              // État de chargement
              <div className="text-center py-20">
                <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
                <p className="text-secondary">Chargement des formateurs...</p>
              </div>
            ) : formateurs.length === 0 ? (
              // État vide
              <div className="text-center py-20">
                <div className="max-w-lg mx-auto">
                  <i className="ph-bold ph-users-three text-9xl text-gray-300 mb-6 block"></i>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    Aucun formateur pour le moment
                  </h2>
                  <p className="text-lg text-secondary mb-8">
                    Notre communauté de formateurs grandit chaque jour. Rejoignez-nous et partagez votre expertise !
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
              // Grid des formateurs
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
                {formateurs.map((formateur) => (
                  <div key={formateur.id} className="formateur-card bg-white rounded-2xl p-6 text-center shadow hover:shadow-lg transition-all duration-300">
                    {/* Avatar */}
                    <div className="mb-4 flex justify-center">
                      <UserAvatar
                        user={{
                          firstName: formateur.firstName,
                          lastName: formateur.lastName,
                          pseudo: formateur.pseudo,
                          avatar: formateur.avatar,
                          avatarColor: formateur.avatarColor,
                          avatarShape: formateur.avatarShape
                        }}
                        size="xl"
                        className="border-4 border-surface"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="heading6 mb-1">{formateur.pseudo}</h3>
                    <p className="text-sm text-secondary mb-4">
                      {formateur.firstName} {formateur.lastName}
                    </p>

                    {/* Bio */}
                    {formateur.bio && (
                      <p className="text-sm text-secondary mb-4 line-clamp-2">
                        {formateur.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-surface rounded-lg p-3">
                        <p className="text-xs text-secondary mb-1">Formations</p>
                        <p className="font-bold text-purple">{formateur.stats.totalFormations}</p>
                      </div>
                      <div className="bg-surface rounded-lg p-3">
                        <p className="text-xs text-secondary mb-1">Étudiants</p>
                        <p className="font-bold text-blue">{formateur.stats.totalStudents}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    {formateur.stats.globalRating > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`ph-fill ph-star text-sm ${
                                i < Math.round(formateur.stats.globalRating) ? 'text-yellow' : 'text-surface'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-sm text-secondary">
                          ({formateur.stats.totalReviews} avis)
                        </span>
                      </div>
                    )}

                    {/* Bouton */}
                    <Link
                      href={`/formateur/${formateur.id}`}
                      className="block w-full px-4 py-2 bg-purple bg-opacity-10 text-purple rounded-lg hover:bg-opacity-20 transition font-semibold text-sm"
                    >
                      Voir le profil
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section CTA */}
        <div className="cta-section bg-gradient-to-br from-black to-gray-800 text-white md:py-20 py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Partagez Votre Expertise
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Rejoignez notre communauté de formateurs et aidez des milliers de personnes à développer leurs compétences
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
