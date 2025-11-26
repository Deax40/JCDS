import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';

export default function FormationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadFormation();
      checkPurchaseStatus();
    }
  }, [id]);

  const loadFormation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/formations/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormation(data.formation);
      }
    } catch (error) {
      console.error('Error loading formation:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/purchases/check?formationId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setHasPurchased(data.hasPurchased);
      }
    } catch (error) {
      console.error('Error checking purchase:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!hasPurchased) {
      alert('Vous devez acheter cette formation pour laisser un avis');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formationId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (response.ok) {
        setNewReview({ rating: 5, comment: '' });
        loadFormation(); // Reload to show new review
        alert('Votre avis a été publié avec succès !');
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la publication de l\'avis');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de la publication de l\'avis');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <>
        <HeaderAnvogue />
        <div className="container py-20 text-center">
          <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
          <p className="text-secondary">Chargement...</p>
        </div>
        <FooterAnvogue />
      </>
    );
  }

  if (!formation) {
    return (
      <>
        <HeaderAnvogue />
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Formation non trouvée</h1>
          <p className="text-secondary mb-8">Cette formation n'existe pas ou n'est plus disponible.</p>
          <Link href="/formations" className="button-main">
            Voir toutes les formations
          </Link>
        </div>
        <FooterAnvogue />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{formation.title} - FormationPlace</title>
        <meta name="description" content={formation.description.substring(0, 160)} />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${formation.category.gradient} text-white py-12 md:py-16`}>
          <div className="container">
            {/* Breadcrumb */}
            <div className="mb-6 text-sm opacity-90">
              <Link href="/" className="hover:underline">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href={`/categories/${formation.category.slug}`} className="hover:underline">
                {formation.category.name}
              </Link>
              <span className="mx-2">/</span>
              <span>{formation.title}</span>
            </div>

            {/* Title and Category */}
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full mb-4">
                <i className={`ph-bold ${formation.category.icon} mr-2`}></i>
                {formation.category.name}
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                {formation.title}
              </h1>

              {/* Tags */}
              {formation.tags && formation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formation.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                <div>
                  <i className="ph-bold ph-calendar mr-2"></i>
                  Créé le {new Date(formation.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <i className="ph-bold ph-graduation-cap mr-2"></i>
                  {formation.totalSales} étudiant{formation.totalSales > 1 ? 's' : ''}
                </div>
                {formation.averageRating > 0 && (
                  <div className="flex items-center">
                    <i className="ph-fill ph-star text-yellow mr-1"></i>
                    {formation.averageRating.toFixed(1)} ({formation.totalReviews} avis)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-surface py-12 md:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Formation Details */}
              <div className="lg:col-span-2">
                {/* Description */}
                <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow">
                  <h2 className="heading4 mb-4">Description</h2>
                  <div className="text-secondary whitespace-pre-wrap">
                    {formation.description}
                  </div>
                </div>

                {/* Formation Type Badge */}
                <div className="bg-white rounded-2xl p-6 mb-6 shadow">
                  <h3 className="heading5 mb-3">Type de formation</h3>
                  {formation.type === 'pdf' && (
                    <div className="flex items-center gap-3 text-purple">
                      <i className="ph-bold ph-file-pdf text-3xl"></i>
                      <div>
                        <p className="font-semibold">Formation PDF</p>
                        <p className="text-sm text-secondary">Document téléchargeable</p>
                      </div>
                    </div>
                  )}
                  {formation.type === 'visio' && (
                    <div className="flex items-center gap-3 text-blue">
                      <i className="ph-bold ph-video-camera text-3xl"></i>
                      <div>
                        <p className="font-semibold">Formation en Visio</p>
                        <p className="text-sm text-secondary">
                          {formation.visioDate && `Le ${new Date(formation.visioDate).toLocaleDateString('fr-FR')} à ${new Date(formation.visioDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                          {formation.visioDuration && ` - Durée: ${formation.visioDuration} min`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avis Section */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow">
                  <h2 className="heading4 mb-6">
                    Avis ({formation.reviews.length})
                  </h2>

                  {/* Review Form - Only for buyers */}
                  {hasPurchased && (
                    <div className="mb-8 p-6 bg-surface rounded-xl">
                      <h3 className="heading5 mb-4">Laisser un avis</h3>
                      <form onSubmit={handleSubmitReview}>
                        {/* Rating */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">Note</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="text-3xl"
                              >
                                <i className={`ph-fill ph-star ${star <= newReview.rating ? 'text-yellow' : 'text-gray-300'}`}></i>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">Votre avis</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:border-purple focus:outline-none resize-none"
                            rows="4"
                            placeholder="Partagez votre expérience avec cette formation..."
                            required
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="button-main w-full disabled:opacity-50"
                        >
                          {submittingReview ? 'Publication...' : 'Publier mon avis'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  {formation.reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="ph-bold ph-chat-centered-dots text-6xl text-gray-300 mb-3"></i>
                      <p className="text-secondary">Aucun avis pour le moment</p>
                      {hasPurchased && (
                        <p className="text-sm text-purple mt-2">Soyez le premier à laisser un avis !</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formation.reviews.map((review) => (
                        <div key={review.id} className="border-b border-line pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            {review.buyer.avatar ? (
                              <img
                                src={review.buyer.avatar}
                                alt={review.buyer.pseudo}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-blue flex items-center justify-center text-white font-bold">
                                {review.buyer.firstName?.charAt(0)}{review.buyer.lastName?.charAt(0)}
                              </div>
                            )}

                            <div className="flex-1">
                              {/* Name and rating */}
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{review.buyer.pseudo}</p>
                                  <p className="text-xs text-secondary">
                                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`ph-fill ph-star text-sm ${
                                        i < review.rating ? 'text-yellow' : 'text-gray-300'
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                              </div>

                              {/* Comment */}
                              <p className="text-secondary">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* Purchase Card */}
                <div className="bg-white rounded-2xl p-6 shadow mb-6 sticky top-24">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-purple mb-2">
                      {formation.priceTTC.toFixed(2)} €
                    </div>
                    <div className="text-sm text-secondary">
                      Prix TTC - Net: {formation.priceNet.toFixed(2)} €
                    </div>
                  </div>

                  {/* Limits */}
                  {formation.hasQuantityLimit && (
                    <div className="mb-4 p-3 bg-orange bg-opacity-10 rounded-lg">
                      <p className="text-sm text-orange font-semibold">
                        <i className="ph-bold ph-warning mr-2"></i>
                        Places limitées: {formation.quantitySold}/{formation.quantityLimit}
                      </p>
                    </div>
                  )}

                  {formation.hasTimeLimit && (
                    <div className="mb-4 p-3 bg-red bg-opacity-10 rounded-lg">
                      <p className="text-sm text-red font-semibold">
                        <i className="ph-bold ph-clock mr-2"></i>
                        Disponible jusqu'au {new Date(formation.timeLimitDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}

                  <button className="button-main w-full mb-3">
                    <i className="ph-bold ph-shopping-cart mr-2"></i>
                    Acheter maintenant
                  </button>

                  <div className="text-center text-xs text-secondary">
                    <i className="ph-bold ph-lock mr-1"></i>
                    Paiement sécurisé
                  </div>
                </div>

                {/* Seller Profile */}
                <div className="bg-white rounded-2xl p-6 shadow">
                  <h3 className="heading5 mb-4">À propos du formateur</h3>

                  <div className="text-center mb-4">
                    {formation.seller.avatar ? (
                      <img
                        src={formation.seller.avatar}
                        alt={formation.seller.pseudo}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-surface"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-purple to-blue flex items-center justify-center text-white text-2xl font-bold border-4 border-surface">
                        {formation.seller.firstName?.charAt(0)}{formation.seller.lastName?.charAt(0)}
                      </div>
                    )}
                    <p className="font-bold text-lg">{formation.seller.pseudo}</p>
                    <p className="text-sm text-secondary">
                      {formation.seller.firstName} {formation.seller.lastName}
                    </p>
                  </div>

                  {/* Bio */}
                  {formation.seller.bio && (
                    <div className="mb-4">
                      <p className="text-sm text-secondary">{formation.seller.bio}</p>
                    </div>
                  )}

                  {/* Competences */}
                  {formation.seller.competences && formation.seller.competences.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-secondary mb-2">COMPÉTENCES</p>
                      <div className="flex flex-wrap gap-2">
                        {formation.seller.competences.map((comp, index) => (
                          <span key={index} className="px-2 py-1 bg-purple bg-opacity-10 text-purple text-xs rounded-full">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {formation.seller.website && (
                    <div className="mb-4">
                      <a
                        href={formation.seller.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple hover:underline"
                      >
                        <i className="ph-bold ph-globe"></i>
                        Site web
                      </a>
                    </div>
                  )}

                  {/* Social Media */}
                  {(formation.seller.socials.instagram || formation.seller.socials.twitter || formation.seller.socials.facebook || formation.seller.socials.linkedin) && (
                    <div>
                      <p className="text-xs font-semibold text-secondary mb-3">RÉSEAUX SOCIAUX</p>
                      <div className="flex gap-3">
                        {formation.seller.socials.instagram && (
                          <a
                            href={formation.seller.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-pink flex items-center justify-center text-white hover:scale-110 transition-transform"
                          >
                            <i className="ph-bold ph-instagram-logo text-xl"></i>
                          </a>
                        )}
                        {formation.seller.socials.twitter && (
                          <a
                            href={formation.seller.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform"
                          >
                            <i className="ph-bold ph-x-logo text-xl"></i>
                          </a>
                        )}
                        {formation.seller.socials.facebook && (
                          <a
                            href={formation.seller.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-white hover:scale-110 transition-transform"
                          >
                            <i className="ph-bold ph-facebook-logo text-xl"></i>
                          </a>
                        )}
                        {formation.seller.socials.linkedin && (
                          <a
                            href={formation.seller.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-white hover:scale-110 transition-transform"
                          >
                            <i className="ph-bold ph-linkedin-logo text-xl"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/formateur/${formation.seller.id}`}
                    className="block w-full mt-4 px-4 py-2 text-center bg-purple bg-opacity-10 text-purple rounded-lg hover:bg-opacity-20 transition font-semibold text-sm"
                  >
                    Voir le profil complet
                  </Link>
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
