import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormationCard from '../components/FormationCard';

export default function Home() {
  // Données exemple - à remplacer par des appels API
  const featuredFormations = [
    {
      id: 1,
      slug: 'formation-react-avancee',
      title: 'Maîtrisez React et Next.js',
      cover_image_url: '/assets/img/formations/1.jpg',
      price: 89.00,
      promo_price: 59.00,
      is_promo_active: true,
      average_rating: 4.5,
      seller_name: 'Jean Dupont',
      category_name: 'Développement Web'
    },
    // Ajouter plus de formations...
  ];

  return (
    <>
      <Head>
        <title>FormationPlace - Marketplace de Formations en Ligne</title>
        <meta name="description" content="Découvrez des milliers de formations en ligne créées par des formateurs experts. Développez vos compétences dès aujourd'hui." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="site-content">
        <Header />

        {/* Slider Principal */}
        <section className="slider-wrapper">
          <div className="slider-start slider-1 owl-carousel owl-theme">
            <div className="item">
              <img src="/assets/img/slider/f1.jpg" alt="Nouvelles formations" />
              <div className="container-fluid custom-container slider-content">
                <div className="row align-items-center">
                  <div className="col-12 col-sm-8 col-md-8 col-lg-6 ml-auto">
                    <div className="slider-text">
                      <h4 className="animated fadeInUp">
                        <span>NOUVELLES</span> FORMATIONS
                      </h4>
                      <h1 className="animated fadeInUp">APPRENEZ AUJOURD&apos;HUI</h1>
                      <p className="animated fadeInUp">
                        Découvrez des centaines de formations créées par des experts
                        passionnés. Développez vos compétences à votre rythme.
                      </p>
                      <Link className="animated fadeInUp btn-two" href="/formations">
                        DÉCOUVRIR LES FORMATIONS
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <img src="/assets/img/slider/f2.jpg" alt="Devenez formateur" />
              <div className="container-fluid custom-container slider-content">
                <div className="row align-items-center">
                  <div className="col-12 col-sm-8 col-md-8 col-lg-6 ml-auto">
                    <div className="slider-text">
                      <h4 className="animated fadeIn">
                        <span>PARTAGEZ</span> VOTRE EXPERTISE
                      </h4>
                      <h1 className="animated fadeIn">DEVENEZ FORMATEUR</h1>
                      <p className="animated fadeIn">
                        Créez et vendez vos formations en ligne. Rejoignez notre
                        communauté de formateurs experts et générez des revenus.
                      </p>
                      <Link className="animated fadeIn btn-two" href="/devenir-formateur">
                        COMMENCER MAINTENANT
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <img src="/assets/img/slider/f3.jpg" alt="Promotions" />
              <div className="container-fluid custom-container slider-content">
                <div className="row align-items-center">
                  <div className="col-12 col-sm-8 col-md-8 offset-md-1 col-lg-6 offset-xl-2 col-xl-5 mr-auto">
                    <div className="slider-text mob-align-left">
                      <h4 className="animated fadeIn">
                        <span>OFFRES SPÉCIALES</span> LIMITÉES
                      </h4>
                      <h1 className="animated fadeIn">JUSQU&apos;À -50%</h1>
                      <p className="animated fadeIn">
                        Profitez de réductions exceptionnelles sur une sélection de
                        formations. Offre limitée dans le temps.
                      </p>
                      <Link className="animated fadeIn btn-two" href="/formations?filter=promo">
                        VOIR LES PROMOS
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bannières Catégories */}
        <section className="banner padding-top-120">
          <div className="container-fluid custom-container">
            <div className="row">
              <div className="col-12 col-md-4">
                <Link href="/categories/developpement-web">
                  <div className="sin-banner align-items-center">
                    <img src="/assets/img/banners/2.png" alt="Développement" />
                    <div className="sin-banner-con">
                      <div className="sin-banner-inner-wrap">
                        <div className="banner-top">
                          <h4>Développement</h4>
                          <h4>Web & <span>Mobile</span></h4>
                        </div>
                        <p>Plus de</p>
                        <h3>200 cours</h3>
                        <span>Débutant à</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-md-4">
                <Link href="/categories/business-marketing">
                  <div className="sin-banner style-two">
                    <img src="/assets/img/banners/3.png" alt="Business" />
                    <div className="sin-banner-con">
                      <div className="sin-banner-inner-wrap">
                        <h4>Business & Marketing</h4>
                        <h3>150+ Formations</h3>
                        <span>Boostez votre carrière</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-md-4">
                <Link href="/categories/design">
                  <div className="sin-banner">
                    <img src="/assets/img/banners/5.png" alt="Design" />
                    <div className="br-wrapper">
                      <div className="sin-banner-con-right">
                        <p>Design Graphique</p>
                        <span>Créativité & Innovation</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Formations avec filtres */}
        <section className="main-product">
          <div className="container container-two">
            <div className="section-heading">
              <h3>Explorez nos <span>formations</span></h3>
            </div>

            <div className="row">
              <div className="col-xl-12">
                <div className="pro-tab-filter">
                  <ul className="pro-tab-button">
                    <li className="filter active" data-filter="*">TOUTES</li>
                    <li className="filter" data-filter=".developpement">Développement</li>
                    <li className="filter" data-filter=".business">Business</li>
                    <li className="filter" data-filter=".design">Design</li>
                    <li className="filter" data-filter=".photo">Photographie</li>
                  </ul>

                  <div className="grid row">
                    {/* Les cartes de formations seront générées ici */}
                    <div className="grid-item developpement col-6 col-md-6 col-lg-4 col-xl-3">
                      <FormationCard formation={featuredFormations[0]} />
                    </div>
                    {/* Répéter pour chaque formation */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="feature-area">
          <div className="container-fluid custom-container">
            <div className="row">
              <div className="col-sm-6 col-xl-3">
                <div className="sin-feature">
                  <div className="inner-sin-feature">
                    <div className="icon">
                      <i className="flaticon-free-delivery"></i>
                    </div>
                    <div className="f-content">
                      <h6><Link href="#">ACCÈS IMMÉDIAT</Link></h6>
                      <p>Accès instantané à vos formations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="sin-feature">
                  <div className="inner-sin-feature">
                    <div className="icon">
                      <i className="flaticon-shopping-online-support"></i>
                    </div>
                    <div className="f-content">
                      <h6><Link href="#">SUPPORT 24/7</Link></h6>
                      <p>Assistance en ligne disponible</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="sin-feature">
                  <div className="inner-sin-feature">
                    <div className="icon">
                      <i className="flaticon-return-of-investment"></i>
                    </div>
                    <div className="f-content">
                      <h6><Link href="#">SATISFAIT OU REMBOURSÉ</Link></h6>
                      <p>Garantie de remboursement sous 30 jours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="sin-feature">
                  <div className="inner-sin-feature">
                    <div className="icon">
                      <i className="flaticon-sign"></i>
                    </div>
                    <div className="f-content">
                      <h6><Link href="#">CERTIFICATS</Link></h6>
                      <p>Obtenez des certifications reconnues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nouvelles formations tendances */}
        <section className="banner-product">
          <div className="container container-two">
            <div className="section-heading pb-30">
              <h3>NOUVELLES <span>TENDANCES</span></h3>
            </div>

            <div className="row justify-content-center">
              {/* Cartes de formations style 2 */}
              <div className="col-xl-6 col-lg-4 col-md-8">
                <FormationCard formation={featuredFormations[0]} style="two" />
              </div>
              {/* Répéter pour d'autres formations */}
            </div>
          </div>
        </section>

        {/* Bannière publicitaire */}
        <section className="add-area">
          <Link href="/formations?filter=promo">
            <img src="/assets/img/add.jpg" alt="Promotion spéciale" />
          </Link>
        </section>

        {/* Petites formations (TOP SALE, TOP RATED, etc.) */}
        <section className="product-small">
          <div className="container-fluid custom-container">
            <div className="row">
              <div className="col-sm-6 col-md-6 col-xl-3">
                <div className="small-sec-title">
                  <h6>LES PLUS <span>VENDUES</span></h6>
                </div>
                {/* Petites cartes de formations */}
              </div>

              <div className="col-sm-6 col-xl-3 col-md-6">
                <div className="small-sec-title">
                  <h6>MIEUX <span>NOTÉES</span></h6>
                </div>
                {/* Petites cartes de formations */}
              </div>

              <div className="col-sm-6 col-xl-3 col-md-6">
                <div className="small-sec-title">
                  <h6>NOUVEAUTÉS <span>DE LA SEMAINE</span></h6>
                </div>
                {/* Petites cartes de formations */}
              </div>

              <div className="col-sm-6 col-xl-3 col-md-6">
                <div className="small-sec-title">
                  <h6>EN <span>PROMOTION</span></h6>
                </div>
                {/* Petites cartes de formations */}
              </div>
            </div>
          </div>
        </section>

        {/* Section Instagram (Témoignages/Success stories) */}
        <section className="instagram-area">
          <div className="instagram-slider owl-carousel owl-theme">
            {/* Images de succès / témoignages visuels */}
            <div className="sin-instagram">
              <img src="/assets/img/success/1.jpg" alt="Success story" />
              <div className="hover-text">
                <Link href="#">
                  <i className="fa fa-star"></i>
                  <span>Success Story</span>
                </Link>
              </div>
            </div>
            {/* Répéter */}
          </div>
        </section>

        <Footer />

        {/* Back to top */}
        <div className="backtotop">
          <i className="fa fa-angle-up backtotop_btn"></i>
        </div>
      </div>
    </>
  );
}
