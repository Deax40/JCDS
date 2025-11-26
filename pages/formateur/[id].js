import Head from 'next/head';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import UserAvatar from '../../components/UserAvatar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

export default function FormateurProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [formateur, setFormateur] = useState(null);
  const [formations, setFormations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadFormateurProfile();
    }
  }, [id]);

  const loadFormateurProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/formateurs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormateur(data.formateur);
        setFormations(data.formations || []);
        setReviews(data.reviews || []);

        // Check if current user can leave a review
        if (user && user.id !== parseInt(id)) {
          checkCanReview();
        }
      } else {
        console.error('Error loading formateur profile');
      }
    } catch (error) {
      console.error('Error loading formateur profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const response = await fetch(`/api/formateurs/${id}`);
      if (response.ok) {
        const data = await response.json();
        // If user has formations from this formateur, they can review
        setCanReview(data.formations && data.formations.length > 0);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedFormation) {
      alert('Veuillez sélectionner une formation');
      return;
    }

    if (comment.trim().length < 10) {
      alert('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch('/api/formateurs/leave-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formateurId: id,
          formationId: selectedFormation,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Avis publié avec succès !');
        setShowReviewForm(false);
        setSelectedFormation('');
        setRating(5);
        setComment('');
        loadFormateurProfile(); // Reload to show new review
      } else {
        alert(data.message || 'Erreur lors de la publication de l\'avis');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de la publication de l\'avis');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Chargement... - FormationPlace</title>
        </Head>
        <div className="overflow-x-hidden">
          <HeaderAnvogue />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
              <p className="text-secondary">Chargement du profil...</p>
            </div>
          </div>
          <FooterAnvogue />
        </div>
      </>
    );
  }

  if (!formateur) {
    return (
      <>
        <Head>
          <title>Formateur introuvable - FormationPlace</title>
        </Head>
        <div className="overflow-x-hidden">
          <HeaderAnvogue />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-lg mx-auto p-8">
              <i className="ph-bold ph-user-x text-9xl text-gray-300 mb-6 block"></i>
              <h1 className="heading3 mb-4">Formateur introuvable</h1>
              <p className="text-secondary mb-8">Ce formateur n'existe pas ou n'est plus disponible.</p>
              <Link href="/formateurs" className="button-main">
                Voir tous les formateurs
              </Link>
            </div>
          </div>
          <FooterAnvogue />
        </div>
      </>
    );
  }

  const youtubeId = formateur.showPresentationVideo ? getYouTubeId(formateur.presentationVideoUrl) : null;

  return (
    <>
      <Head>
        <title>{formateur.pseudo} - Formateur - FormationPlace</title>
        <meta name="description" content={formateur.bio || `Profil de ${formateur.pseudo}, formateur sur FormationPlace`} />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple to-pink text-white py-12 md:py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <UserAvatar
                    user={{
                      firstName: formateur.firstName,
                      lastName: formateur.lastName,
                      pseudo: formateur.pseudo,
                      avatar: formateur.avatar,
                      avatarColor: formateur.avatarColor,
                      avatarShape: formateur.avatarShape,
                    }}
                    size="2xl"
                    className="border-4 border-white shadow-2xl"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                    {formateur.pseudo}
                  </h1>
                  <p className="text-lg mb-4 opacity-90">
                    {formateur.firstName} {formateur.lastName}
                  </p>

                  {/* Member since */}
                  <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-6">
                    <i className="ph-bold ph-calendar-check"></i>
                    <span>Formateur depuis {formatDate(formateur.memberSince)}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-sm opacity-80 mb-1">Formations</p>
                      <p className="text-2xl font-bold">{formateur.stats.totalFormations}</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-sm opacity-80 mb-1">Étudiants</p>
                      <p className="text-2xl font-bold">{formateur.stats.totalStudents}</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-sm opacity-80 mb-1">Note moyenne</p>
                      <p className="text-2xl font-bold">{formateur.stats.globalRating.toFixed(1)}</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-sm opacity-80 mb-1">Avis</p>
                      <p className="text-2xl font-bold">{formateur.stats.totalReviews}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-surface md:py-20 py-12">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Video Presentation */}
                  {youtubeId && (
                    <div className="bg-white rounded-2xl p-6 shadow">
                      <h2 className="heading5 mb-4 flex items-center gap-2">
                        <i className="ph-bold ph-video-camera text-purple"></i>
                        Vidéo de présentation
                      </h2>
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`}
                          title="Vidéo de présentation"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {formateur.bio && (
                    <div className="bg-white rounded-2xl p-6 shadow">
                      <h2 className="heading5 mb-4 flex items-center gap-2">
                        <i className="ph-bold ph-user-circle text-purple"></i>
                        À propos
                      </h2>
                      <p className="text-secondary leading-relaxed">{formateur.bio}</p>
                    </div>
                  )}

                  {/* Competences */}
                  {formateur.competences && formateur.competences.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow">
                      <h2 className="heading5 mb-4 flex items-center gap-2">
                        <i className="ph-bold ph-lightbulb text-purple"></i>
                        Compétences
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {formateur.competences.map((comp, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-purple bg-opacity-10 text-purple rounded-full text-sm font-semibold"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {formateur.certifications && formateur.certifications.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow">
                      <h2 className="heading5 mb-4 flex items-center gap-2">
                        <i className="ph-bold ph-certificate text-purple"></i>
                        Certifications et Diplômes
                      </h2>
                      <div className="space-y-4">
                        {formateur.certifications.map((cert, index) => (
                          <div key={index} className="border-l-4 border-purple pl-4 py-2">
                            <h3 className="font-semibold text-lg">{cert.name}</h3>
                            <p className="text-secondary">{cert.issuer}</p>
                            <p className="text-sm text-secondary">{cert.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formations */}
                  <div className="bg-white rounded-2xl p-6 shadow">
                    <h2 className="heading5 mb-6 flex items-center gap-2">
                      <i className="ph-bold ph-book-open text-purple"></i>
                      Formations ({formations.length})
                    </h2>

                    {formations.length === 0 ? (
                      <div className="text-center py-12">
                        <i className="ph-bold ph-book text-6xl text-gray-300 mb-4 block"></i>
                        <p className="text-secondary">Aucune formation publiée pour le moment</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {formations.map((formation) => (
                          <Link
                            key={formation.id}
                            href={`/formation/${formation.id}`}
                            className="block border border-gray-200 rounded-xl p-4 hover:border-purple hover:shadow-md transition-all"
                          >
                            <h3 className="font-semibold mb-2 line-clamp-2">{formation.title}</h3>
                            <p className="text-sm text-secondary mb-3 line-clamp-2">{formation.description}</p>

                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-purple">
                                {formation.priceTTC.toFixed(2)} €
                              </span>
                              {formation.averageRating > 0 && (
                                <div className="flex items-center gap-1">
                                  <i className="ph-fill ph-star text-yellow text-sm"></i>
                                  <span className="text-sm font-semibold">{formation.averageRating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-secondary">
                              <span className="flex items-center gap-1">
                                <i className="ph ph-users"></i>
                                {formation.totalSales || 0} étudiants
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="ph ph-chat-circle"></i>
                                {formation.totalReviews || 0} avis
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reviews Section */}
                  <div className="bg-white rounded-2xl p-6 shadow">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="heading5 flex items-center gap-2">
                        <i className="ph-bold ph-chat-circle-text text-purple"></i>
                        Avis ({reviews.length})
                      </h2>

                      {/* Review Button - Only for logged in users who purchased */}
                      {user && user.id !== parseInt(id) && canReview && (
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="button-main text-sm px-4 py-2"
                        >
                          <i className="ph-bold ph-plus mr-2"></i>
                          Laisser un avis
                        </button>
                      )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                      <form onSubmit={handleSubmitReview} className="bg-surface rounded-xl p-6 mb-6">
                        <h3 className="font-semibold mb-4">Votre avis</h3>

                        {/* Formation Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">
                            Formation concernée *
                          </label>
                          <select
                            value={selectedFormation}
                            onChange={(e) => setSelectedFormation(e.target.value)}
                            className="input w-full"
                            required
                          >
                            <option value="">Sélectionnez une formation</option>
                            {formations.map((formation) => (
                              <option key={formation.id} value={formation.id}>
                                {formation.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Rating */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">
                            Note *
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <i
                                  className={`ph-fill ph-star text-3xl ${
                                    star <= rating ? 'text-yellow' : 'text-gray-300'
                                  }`}
                                ></i>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">
                            Votre commentaire * (min. 10 caractères)
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input w-full"
                            rows="4"
                            placeholder="Partagez votre expérience..."
                            required
                            minLength={10}
                          ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="button-main"
                          >
                            {submittingReview ? 'Publication...' : 'Publier l\'avis'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="button-white"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <i className="ph-bold ph-chat-circle text-6xl text-gray-300 mb-4 block"></i>
                        <p className="text-secondary">Aucun avis pour le moment</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-start gap-3">
                              <UserAvatar
                                user={{
                                  firstName: review.buyer.firstName,
                                  lastName: review.buyer.lastName,
                                  pseudo: review.buyer.pseudo,
                                  avatar: review.buyer.avatar,
                                  avatarColor: review.buyer.avatarColor,
                                  avatarShape: review.buyer.avatarShape,
                                }}
                                size="md"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold">{review.buyer.pseudo}</h4>
                                  <span className="text-xs text-secondary">
                                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-2">
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
                                  <span className="text-xs text-secondary">
                                    • {review.formationTitle}
                                  </span>
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
                <div className="space-y-6">
                  {/* Social Links */}
                  {(formateur.socials.instagram || formateur.socials.twitter || formateur.socials.facebook || formateur.socials.linkedin || formateur.website) && (
                    <div className="bg-white rounded-2xl p-6 shadow">
                      <h3 className="heading6 mb-4">Liens</h3>
                      <div className="space-y-3">
                        {formateur.website && (
                          <a
                            href={formateur.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-secondary hover:text-purple transition"
                          >
                            <i className="ph-bold ph-globe text-xl"></i>
                            <span>Site web</span>
                          </a>
                        )}
                        {formateur.socials.instagram && (
                          <a
                            href={formateur.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-secondary hover:text-purple transition"
                          >
                            <i className="ph-bold ph-instagram-logo text-xl"></i>
                            <span>Instagram</span>
                          </a>
                        )}
                        {formateur.socials.twitter && (
                          <a
                            href={formateur.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-secondary hover:text-purple transition"
                          >
                            <i className="ph-bold ph-twitter-logo text-xl"></i>
                            <span>Twitter</span>
                          </a>
                        )}
                        {formateur.socials.facebook && (
                          <a
                            href={formateur.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-secondary hover:text-purple transition"
                          >
                            <i className="ph-bold ph-facebook-logo text-xl"></i>
                            <span>Facebook</span>
                          </a>
                        )}
                        {formateur.socials.linkedin && (
                          <a
                            href={formateur.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-secondary hover:text-purple transition"
                          >
                            <i className="ph-bold ph-linkedin-logo text-xl"></i>
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact CTA */}
                  <div className="bg-gradient-to-br from-purple to-pink text-white rounded-2xl p-6 shadow">
                    <h3 className="font-display text-xl font-bold mb-3">
                      Vous aimez ce formateur ?
                    </h3>
                    <p className="text-sm mb-4 opacity-90">
                      Explorez ses formations et commencez à apprendre dès aujourd'hui
                    </p>
                    <Link href={`#formations`} className="block w-full px-4 py-3 bg-white text-purple rounded-lg hover:bg-opacity-90 transition font-semibold text-center">
                      Voir les formations
                    </Link>
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
