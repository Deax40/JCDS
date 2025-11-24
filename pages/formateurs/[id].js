import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FormationCard from '../../components/FormationCard';

export default function FormateurProfile() {
  const router = useRouter();
  const { id } = router.query;

  // Données exemple - à remplacer par un appel API
  const formateur = {
    id: 5,
    display_name: 'Jean Dupont',
    avatar_url: '/assets/img/sellers/jean-dupont.jpg',
    bio_short: 'Développeur Full-Stack passionné avec plus de 10 ans d\'expérience',
    bio_long: `
      Bonjour ! Je suis Jean Dupont, développeur Full-Stack depuis plus de 10 ans.

      Passionné par les nouvelles technologies, j'ai travaillé sur de nombreux projets web et mobile
      pour des startups et des grandes entreprises. Aujourd'hui, je partage mon expertise à travers
      des formations pratiques et orientées projet.

      Mon objectif est de vous transmettre non seulement les compétences techniques, mais aussi
      les bonnes pratiques et méthodologies que j'ai acquises tout au long de ma carrière.

      Rejoignez mes formations et développons ensemble vos compétences en développement web !
    `,
    average_rating: 4.7,
    total_reviews: 342,
    total_formations: 8,
    total_sales: 1247,
    phone: '+33 6 12 34 56 78',
    website_url: 'https://jeandupont-dev.com',
    linkedin_url: 'https://linkedin.com/in/jeandupont',
    email: 'contact@jeandupont-dev.com',
    created_at: '2023-03-15'
  };

  const formations = [
    {
      id: 1,
      slug: 'formation-react-nextjs',
      title: 'Maîtrisez React et Next.js',
      cover_image_url: '/assets/img/formations/1.jpg',
      price: 89.00,
      promo_price: 59.00,
      is_promo_active: true,
      average_rating: 4.5,
      total_reviews: 127,
      seller_name: 'Jean Dupont'
    },
    {
      id: 2,
      slug: 'formation-nodejs-express',
      title: 'Node.js et Express - Backend Complet',
      cover_image_url: '/assets/img/formations/2.jpg',
      price: 79.00,
      promo_price: null,
      is_promo_active: false,
      average_rating: 4.8,
      total_reviews: 89,
      seller_name: 'Jean Dupont'
    },
    {
      id: 3,
      slug: 'formation-mongodb',
      title: 'MongoDB de A à Z',
      cover_image_url: '/assets/img/formations/3.jpg',
      price: 69.00,
      promo_price: 49.00,
      is_promo_active: true,
      average_rating: 4.6,
      total_reviews: 74,
      seller_name: 'Jean Dupont'
    },
    // Ajoutez d'autres formations...
  ];

  const reviews = [
    {
      id: 1,
      buyer_name: 'Marie L.',
      formation_title: 'Maîtrisez React et Next.js',
      rating: 5,
      comment: 'Excellent formateur ! Très pédagogue et patient. Je recommande vivement.',
      created_at: '2025-01-15'
    },
    {
      id: 2,
      buyer_name: 'Pierre M.',
      formation_title: 'Node.js et Express',
      rating: 5,
      comment: 'Formation de très grande qualité. Jean sait expliquer les concepts complexes simplement.',
      created_at: '2025-01-10'
    },
    {
      id: 3,
      buyer_name: 'Sophie D.',
      formation_title: 'MongoDB de A à Z',
      rating: 4,
      comment: 'Très bonne formation, contenu riche et bien structuré.',
      created_at: '2025-01-08'
    }
  ];

  return (
    <>
      <Head>
        <title>{formateur.display_name} - Formateur | FormationPlace</title>
        <meta name="description" content={formateur.bio_short} />
      </Head>

      <div className="site-content">
        <Header />

        {/* Fil d'Ariane */}
        <section className="breadcrumb-area">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-content">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link href="/">Accueil</Link></li>
                      <li className="breadcrumb-item"><Link href="/formateurs">Formateurs</Link></li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {formateur.display_name}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profil du formateur */}
        <section className="seller-profile-area section-padding">
          <div className="container">
            {/* En-tête du profil */}
            <div className="row">
              <div className="col-12">
                <div className="seller-profile-header">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                      <img
                        src={formateur.avatar_url}
                        alt={formateur.display_name}
                        className="seller-avatar-large"
                      />
                    </div>
                    <div className="col-md-9">
                      <h1 className="seller-name">{formateur.display_name}</h1>
                      <p className="seller-tagline">{formateur.bio_short}</p>

                      {/* Statistiques */}
                      <div className="seller-stats">
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="stat-content">
                            <h3>{formateur.average_rating.toFixed(1)}</h3>
                            <p>Note moyenne</p>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-comment"></i>
                          </div>
                          <div className="stat-content">
                            <h3>{formateur.total_reviews}</h3>
                            <p>Avis reçus</p>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-book"></i>
                          </div>
                          <div className="stat-content">
                            <h3>{formateur.total_formations}</h3>
                            <p>Formations</p>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-users"></i>
                          </div>
                          <div className="stat-content">
                            <h3>{formateur.total_sales}</h3>
                            <p>Apprenants</p>
                          </div>
                        </div>
                      </div>

                      {/* Étoiles de notation */}
                      <div className="seller-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={
                              star <= Math.floor(formateur.average_rating)
                                ? 'fas fa-star'
                                : star - 0.5 <= formateur.average_rating
                                ? 'fas fa-star-half'
                                : 'far fa-star'
                            }
                          ></i>
                        ))}
                        <span>({formateur.total_reviews} avis)</span>
                      </div>

                      {/* Liens de contact */}
                      <div className="seller-contact-links">
                        {formateur.website_url && (
                          <a
                            href={formateur.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                          >
                            <i className="fas fa-globe"></i> Site web
                          </a>
                        )}
                        {formateur.linkedin_url && (
                          <a
                            href={formateur.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                          >
                            <i className="fab fa-linkedin"></i> LinkedIn
                          </a>
                        )}
                        {formateur.email && (
                          <a href={`mailto:${formateur.email}`} className="contact-link">
                            <i className="fas fa-envelope"></i> Email
                          </a>
                        )}
                        {formateur.phone && (
                          <a href={`tel:${formateur.phone}`} className="contact-link">
                            <i className="fas fa-phone"></i> Téléphone
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs : À propos / Formations / Avis */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="seller-tabs">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" data-toggle="tab" href="#about">
                        À propos
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-toggle="tab" href="#formations">
                        Formations ({formateur.total_formations})
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-toggle="tab" href="#reviews">
                        Avis ({formateur.total_reviews})
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* À propos */}
                    <div id="about" className="tab-pane active">
                      <div className="about-seller">
                        <h3>Biographie</h3>
                        <div className="bio-content">
                          {formateur.bio_long.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                        <div className="seller-meta">
                          <p>
                            <strong>Membre depuis :</strong>{' '}
                            {new Date(formateur.created_at).toLocaleDateString('fr-FR', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Formations */}
                    <div id="formations" className="tab-pane">
                      <div className="seller-formations">
                        <div className="row">
                          {formations.map((formation) => (
                            <div key={formation.id} className="col-md-6 col-lg-4 col-xl-3">
                              <FormationCard formation={formation} style="two" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Avis */}
                    <div id="reviews" className="tab-pane">
                      <div className="seller-reviews">
                        <div className="reviews-summary">
                          <div className="average-rating">
                            <h2>{formateur.average_rating.toFixed(1)}</h2>
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={
                                    star <= Math.floor(formateur.average_rating)
                                      ? 'fas fa-star'
                                      : star - 0.5 <= formateur.average_rating
                                      ? 'fas fa-star-half'
                                      : 'far fa-star'
                                  }
                                ></i>
                              ))}
                            </div>
                            <p>{formateur.total_reviews} avis</p>
                          </div>
                        </div>

                        <div className="reviews-list">
                          {reviews.map((review) => (
                            <div key={review.id} className="single-review">
                              <div className="review-header">
                                <span className="reviewer-name">{review.buyer_name}</span>
                                <div className="review-rating">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={
                                        star <= review.rating ? 'fas fa-star' : 'far fa-star'
                                      }
                                    ></i>
                                  ))}
                                </div>
                                <span className="review-date">
                                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <p className="formation-title-review">
                                Formation : {review.formation_title}
                              </p>
                              <p className="review-comment">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        <div className="backtotop">
          <i className="fa fa-angle-up backtotop_btn"></i>
        </div>
      </div>
    </>
  );
}
