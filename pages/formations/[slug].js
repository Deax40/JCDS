import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FormationDetail() {
  const router = useRouter();
  const { slug } = router.query;

  // Données exemple - à remplacer par un appel API
  const formation = {
    id: 1,
    title: 'Maîtrisez React et Next.js de A à Z',
    slug: 'formation-react-nextjs',
    description_short: 'Apprenez à créer des applications web modernes avec React et Next.js',
    description_long: `
      <p>Cette formation complète vous permettra de maîtriser React et Next.js, deux des technologies les plus demandées dans le développement web moderne.</p>
      <p>Au cours de cette formation, vous apprendrez :</p>
      <ul>
        <li>Les fondamentaux de React (composants, hooks, state management)</li>
        <li>Next.js et le rendu côté serveur (SSR)</li>
        <li>L'optimisation des performances</li>
        <li>Le déploiement sur Vercel</li>
        <li>Les bonnes pratiques de développement</li>
      </ul>
      <p>À la fin de cette formation, vous serez capable de créer des applications web professionnelles et performantes.</p>
    `,
    cover_image_url: '/assets/img/formations/detail/main.jpg',
    images: [
      '/assets/img/formations/detail/1.jpg',
      '/assets/img/formations/detail/2.jpg',
      '/assets/img/formations/detail/3.jpg',
      '/assets/img/formations/detail/4.jpg'
    ],
    price: 89.00,
    promo_price: 59.00,
    is_promo_active: true,
    average_rating: 4.5,
    total_reviews: 127,
    total_sales: 342,
    category: {
      id: 1,
      name: 'Développement Web',
      slug: 'developpement-web'
    },
    seller: {
      id: 5,
      display_name: 'Jean Dupont',
      avatar_url: '/assets/img/sellers/jean-dupont.jpg',
      average_rating: 4.7,
      total_formations: 8
    },
    tags: ['React', 'Next.js', 'JavaScript', 'Frontend', 'Web Development'],
    is_active: true
  };

  const reviews = [
    {
      id: 1,
      buyer_name: 'Marie L.',
      rating: 5,
      comment: 'Excellente formation ! Très complète et bien expliquée. Je recommande vivement.',
      created_at: '2025-01-15'
    },
    {
      id: 2,
      buyer_name: 'Pierre M.',
      rating: 4,
      comment: 'Très bonne formation, quelques passages un peu rapides mais dans l\'ensemble très satisfait.',
      created_at: '2025-01-10'
    },
    {
      id: 3,
      buyer_name: 'Sophie D.',
      rating: 5,
      comment: 'Formation au top ! J\'ai appris énormément de choses. Le formateur est pédagogue.',
      created_at: '2025-01-08'
    }
  ];

  const displayPrice = formation.is_promo_active ? formation.promo_price : formation.price;
  const hasPromo = formation.is_promo_active && formation.promo_price < formation.price;

  return (
    <>
      <Head>
        <title>{formation.title} | FormationPlace</title>
        <meta name="description" content={formation.description_short} />
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
                      <li className="breadcrumb-item"><Link href="/formations">Formations</Link></li>
                      <li className="breadcrumb-item">
                        <Link href={`/categories/${formation.category.slug}`}>
                          {formation.category.name}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {formation.title}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Détails de la formation */}
        <section className="product-details-area section-padding">
          <div className="container">
            <div className="row">
              {/* Images de la formation */}
              <div className="col-lg-6">
                <div className="product-details-image">
                  <div className="main-image">
                    <img src={formation.cover_image_url} alt={formation.title} />
                    {hasPromo && (
                      <span className="badge-promo-large">
                        -{Math.round((1 - formation.promo_price / formation.price) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="image-gallery">
                    {formation.images.map((img, idx) => (
                      <div key={idx} className="gallery-item">
                        <img src={img} alt={`${formation.title} - image ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informations de la formation */}
              <div className="col-lg-6">
                <div className="product-details-content">
                  <h1 className="formation-title">{formation.title}</h1>

                  {/* Formateur */}
                  <div className="seller-info">
                    <Link href={`/formateurs/${formation.seller.id}`} className="seller-link">
                      <img
                        src={formation.seller.avatar_url}
                        alt={formation.seller.display_name}
                        className="seller-avatar"
                      />
                      <span className="seller-name">{formation.seller.display_name}</span>
                    </Link>
                    <div className="seller-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={
                            star <= Math.floor(formation.seller.average_rating)
                              ? 'fas fa-star'
                              : star - 0.5 <= formation.seller.average_rating
                              ? 'fas fa-star-half'
                              : 'far fa-star'
                          }
                        ></i>
                      ))}
                      <span>({formation.seller.total_formations} formations)</span>
                    </div>
                  </div>

                  {/* Note de la formation */}
                  <div className="formation-rating">
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={
                            star <= Math.floor(formation.average_rating)
                              ? 'fas fa-star'
                              : star - 0.5 <= formation.average_rating
                              ? 'fas fa-star-half'
                              : 'far fa-star'
                          }
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">
                      {formation.average_rating.toFixed(1)} ({formation.total_reviews} avis)
                    </span>
                    <span className="sales-text">
                      • {formation.total_sales} acheteurs
                    </span>
                  </div>

                  {/* Prix */}
                  <div className="price-section">
                    {hasPromo && (
                      <span className="old-price">{formation.price.toFixed(2)}€</span>
                    )}
                    <span className="current-price">{displayPrice.toFixed(2)}€</span>
                  </div>

                  {/* Description courte */}
                  <p className="short-description">{formation.description_short}</p>

                  {/* Catégorie et Tags */}
                  <div className="meta-info">
                    <p>
                      <strong>Catégorie :</strong>{' '}
                      <Link href={`/categories/${formation.category.slug}`}>
                        {formation.category.name}
                      </Link>
                    </p>
                    {formation.tags && formation.tags.length > 0 && (
                      <p>
                        <strong>Tags :</strong>{' '}
                        {formation.tags.map((tag, idx) => (
                          <span key={idx} className="tag-badge">{tag}</span>
                        ))}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="product-actions">
                    <button className="btn btn-primary btn-add-cart">
                      <i className="flaticon-shopping-cart"></i>
                      Ajouter au panier
                    </button>
                    <button className="btn btn-secondary btn-wishlist">
                      <i className="flaticon-valentines-heart"></i>
                      Ajouter aux favoris
                    </button>
                  </div>

                  {/* Partage social */}
                  <div className="product-social">
                    <span>Partager :</span>
                    <ul>
                      <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                      <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                      <li><a href="#"><i className="fab fa-whatsapp"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Description complète et Avis */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="product-tabs">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" data-toggle="tab" href="#description">
                        Description
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-toggle="tab" href="#reviews">
                        Avis ({formation.total_reviews})
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* Description */}
                    <div id="description" className="tab-pane active">
                      <div
                        className="formation-description"
                        dangerouslySetInnerHTML={{ __html: formation.description_long }}
                      />
                    </div>

                    {/* Avis */}
                    <div id="reviews" className="tab-pane">
                      <div className="reviews-summary">
                        <div className="average-rating">
                          <h2>{formation.average_rating.toFixed(1)}</h2>
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={
                                  star <= Math.floor(formation.average_rating)
                                    ? 'fas fa-star'
                                    : star - 0.5 <= formation.average_rating
                                    ? 'fas fa-star-half'
                                    : 'far fa-star'
                                }
                              ></i>
                            ))}
                          </div>
                          <p>{formation.total_reviews} avis</p>
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
                                    className={star <= review.rating ? 'fas fa-star' : 'far fa-star'}
                                  ></i>
                                ))}
                              </div>
                              <span className="review-date">
                                {new Date(review.created_at).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                          </div>
                        ))}
                      </div>

                      <div className="add-review">
                        <h4>Laisser un avis</h4>
                        <p className="info-text">
                          Vous devez acheter cette formation pour pouvoir laisser un avis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formations similaires */}
        <section className="related-products section-padding-bottom">
          <div className="container">
            <div className="section-heading">
              <h3>Formations <span>similaires</span></h3>
            </div>
            <div className="row">
              {/* Afficher 4 formations similaires */}
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
