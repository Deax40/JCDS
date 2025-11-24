import Head from 'next/head';
import HeaderAnvogue from '../components/HeaderAnvogue';
import FooterAnvogue from '../components/FooterAnvogue';
import SearchBar from '../components/SearchBar';
import Link from 'next/link';

export default function FormateursPage() {
  // Formateurs d'exemple (vide pour l'instant)
  const formateurs = [];

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
        <div className="formateurs-section md:py-20 py-12">
          <div className="container">
            {formateurs.length === 0 ? (
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
                {formateurs.map((formateur, index) => (
                  <div key={index} className="formateur-card bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Card contenu à venir */}
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
