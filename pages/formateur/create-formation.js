import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import PriceCalculator from '../../components/PriceCalculator';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/categories';

export default function CreateFormation() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    categorySlug: '',
    title: '',
    description: '',
    tags: ['', '', ''],
    formationType: 'en_ligne',

    // Visio
    visioLink: '',
    visioDate: '',
    visioTime: '',
    visioDuration: '',

    // Limitations
    hasTimeLimit: false,
    timeLimitDate: '',
    hasQuantityLimit: false,
    quantityLimit: '',

    // Prix
    priceMode: 'ttc',
    priceEntered: '',
    priceTTC: 0,
    priceNet: 0,
    sumupFee: 0,
    platformFee: 0,
  });

  // État pour le PDF
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/formateur/create-formation');
      return;
    }

    if (!user.roles || !user.roles.includes('formateur')) {
      router.push('/mon-compte');
    }
  }, [user, router]);

  if (!user || !user.roles || !user.roles.includes('formateur')) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const handlePriceChange = (priceData) => {
    setFormData({
      ...formData,
      ...priceData,
    });
  };

  // Gestion du PDF
  const handlePdfDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer?.files[0] || e.target?.files[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Veuillez sélectionner un fichier PDF');
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB max
        setError('Le fichier PDF ne doit pas dépasser 50MB');
        return;
      }

      setPdfFile(file);
      setError('');
    }
  };

  const handlePdfDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handlePdfDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removePdf = () => {
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.categorySlug) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.title || formData.title.length < 10) {
      setError('Le titre doit contenir au moins 10 caractères');
      return;
    }

    if (!formData.description || formData.description.length < 50) {
      setError('La description doit contenir au moins 50 caractères');
      return;
    }

    if (formData.formationType === 'visio' && !formData.visioLink) {
      setError('Le lien de visioconférence est requis pour une formation en visio');
      return;
    }

    if (formData.formationType === 'visio' && (!formData.visioDate || !formData.visioTime)) {
      setError('La date et l\'heure sont requises pour une formation en visio');
      return;
    }

    if (formData.formationType === 'pdf' && !pdfFile) {
      setError('Veuillez télécharger un fichier PDF');
      return;
    }

    if (!formData.priceTTC || formData.priceTTC <= 0) {
      setError('Veuillez définir un prix valide');
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les tags (enlever les vides)
      const cleanTags = formData.tags.filter(tag => tag && tag.trim() !== '');

      // Préparer la date/heure de visio
      let visioDateTime = null;
      if (formData.formationType === 'visio' && formData.visioDate && formData.visioTime) {
        visioDateTime = new Date(`${formData.visioDate}T${formData.visioTime}`).toISOString();
      }

      // Utiliser FormData si PDF, sinon JSON
      let response;

      if (formData.formationType === 'pdf' && pdfFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('pdf', pdfFile);
        formDataToSend.append('data', JSON.stringify({
          sellerId: user.id,
          categorySlug: formData.categorySlug,
          title: formData.title,
          description: formData.description,
          tags: cleanTags,
          formationType: formData.formationType,

          hasTimeLimit: formData.hasTimeLimit,
          timeLimitDate: formData.hasTimeLimit && formData.timeLimitDate
            ? new Date(formData.timeLimitDate).toISOString()
            : null,
          hasQuantityLimit: formData.hasQuantityLimit,
          quantityLimit: formData.hasQuantityLimit ? parseInt(formData.quantityLimit) : null,

          priceMode: formData.priceMode,
          priceEntered: parseFloat(formData.priceEntered),
          priceTTC: formData.priceTTC,
          priceNet: formData.priceNet,
          sumupFee: formData.sumupFee,
          platformFee: formData.platformFee,
        }));

        response = await fetch('/api/formateur/create-formation', {
          method: 'POST',
          body: formDataToSend,
        });
      } else {
        response = await fetch('/api/formateur/create-formation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sellerId: user.id,
            categorySlug: formData.categorySlug,
            title: formData.title,
            description: formData.description,
            tags: cleanTags,
            formationType: formData.formationType,

            visioLink: formData.visioLink || null,
            visioDate: visioDateTime,
            visioDuration: parseInt(formData.visioDuration) || null,

            hasTimeLimit: formData.hasTimeLimit,
            timeLimitDate: formData.hasTimeLimit && formData.timeLimitDate
              ? new Date(formData.timeLimitDate).toISOString()
              : null,
            hasQuantityLimit: formData.hasQuantityLimit,
            quantityLimit: formData.hasQuantityLimit ? parseInt(formData.quantityLimit) : null,

            priceMode: formData.priceMode,
            priceEntered: parseFloat(formData.priceEntered),
            priceTTC: formData.priceTTC,
            priceNet: formData.priceNet,
            sumupFee: formData.sumupFee,
            platformFee: formData.platformFee,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur lors de la création de la formation');
        setIsSubmitting(false);
        return;
      }

      // Rediriger vers le dashboard
      router.push('/formateur/dashboard?success=creation');
    } catch (err) {
      console.error('Error creating formation:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Créer une Formation - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="py-16 bg-surface min-h-screen">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link href="/formateur/dashboard" className="text-purple hover:underline mb-4 inline-flex items-center">
                  <i className="ph-bold ph-arrow-left mr-2"></i>
                  Retour au tableau de bord
                </Link>
                <h1 className="heading3 mb-2">Créer une nouvelle formation</h1>
                <p className="text-secondary">Remplissez les informations de votre formation pour la mettre en vente</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Catégorie *</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setFormData({ ...formData, categorySlug: cat.slug })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.categorySlug === cat.slug
                            ? 'border-purple bg-purple bg-opacity-10'
                            : 'border-line hover:border-purple hover:border-opacity-30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                            <i className={`ph-bold ${cat.icon} text-white text-xl`}></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{cat.name}</p>
                            <p className="text-xs text-secondary line-clamp-1">{cat.description}</p>
                          </div>
                          {formData.categorySlug === cat.slug && (
                            <i className="ph-bold ph-check-circle text-purple text-xl"></i>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Titre de la formation *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="Ex: Maîtriser JavaScript de A à Z"
                    required
                    minLength={10}
                  />
                  <p className="text-xs text-secondary mt-1">{formData.title.length} caractères (minimum 10)</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Description / Biographie *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple resize-none"
                    placeholder="Décrivez votre formation, ce que les apprenants vont apprendre, les prérequis, etc..."
                    required
                    minLength={50}
                  />
                  <p className="text-xs text-secondary mt-1">{formData.description.length} caractères (minimum 50)</p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags (Maximum 3)</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[0, 1, 2].map((index) => (
                      <input
                        key={index}
                        type="text"
                        value={formData.tags[index]}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="px-4 py-2 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder={`Tag ${index + 1}`}
                        maxLength={20}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-secondary mt-1">Les tags aident les utilisateurs à trouver votre formation</p>
                </div>

                {/* Type de formation */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Type de formation *</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, formationType: 'en_ligne' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.formationType === 'en_ligne'
                          ? 'border-purple bg-purple bg-opacity-10'
                          : 'border-line hover:border-purple hover:border-opacity-30'
                      }`}
                    >
                      <i className={`ph-bold ph-video text-3xl mb-2 ${formData.formationType === 'en_ligne' ? 'text-purple' : 'text-secondary'}`}></i>
                      <p className="font-semibold">En ligne</p>
                      <p className="text-xs text-secondary">Vidéo en ligne</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, formationType: 'pdf' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.formationType === 'pdf'
                          ? 'border-purple bg-purple bg-opacity-10'
                          : 'border-line hover:border-purple hover:border-opacity-30'
                      }`}
                    >
                      <i className={`ph-bold ph-file-pdf text-3xl mb-2 ${formData.formationType === 'pdf' ? 'text-purple' : 'text-secondary'}`}></i>
                      <p className="font-semibold">PDF</p>
                      <p className="text-xs text-secondary">Document unique</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, formationType: 'visio' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.formationType === 'visio'
                          ? 'border-purple bg-purple bg-opacity-10'
                          : 'border-line hover:border-purple hover:border-opacity-30'
                      }`}
                    >
                      <i className={`ph-bold ph-users-three text-3xl mb-2 ${formData.formationType === 'visio' ? 'text-purple' : 'text-secondary'}`}></i>
                      <p className="font-semibold">Visio</p>
                      <p className="text-xs text-secondary">Visioconférence</p>
                    </button>
                  </div>
                </div>

                {/* Champs spécifiques PDF */}
                {formData.formationType === 'pdf' && (
                  <div className="p-6 bg-red bg-opacity-5 rounded-xl border border-red border-opacity-20">
                    <h3 className="font-semibold flex items-center mb-4">
                      <i className="ph-bold ph-file-pdf text-red mr-2"></i>
                      Télécharger le PDF
                    </h3>

                    {!pdfFile ? (
                      <div
                        onDrop={handlePdfDrop}
                        onDragOver={handlePdfDragOver}
                        onDragLeave={handlePdfDragLeave}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                          isDragging
                            ? 'border-red bg-red bg-opacity-10'
                            : 'border-line hover:border-red hover:bg-red hover:bg-opacity-5'
                        }`}
                      >
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handlePdfDrop}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                          <i className="ph-bold ph-upload-simple text-5xl text-red mb-4 block"></i>
                          <p className="font-semibold mb-2">
                            Glissez-déposez votre PDF ici
                          </p>
                          <p className="text-sm text-secondary mb-4">
                            ou cliquez pour sélectionner un fichier
                          </p>
                          <p className="text-xs text-secondary">
                            Taille maximale: 50MB
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-line p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-red bg-opacity-10 flex items-center justify-center">
                              <i className="ph-bold ph-file-pdf text-red text-2xl"></i>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{pdfFile.name}</p>
                              <p className="text-xs text-secondary">
                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removePdf}
                            className="w-8 h-8 rounded-lg bg-red bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center text-red transition"
                          >
                            <i className="ph-bold ph-x text-lg"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Champs spécifiques Visio */}
                {formData.formationType === 'visio' && (
                  <div className="p-6 bg-purple bg-opacity-5 rounded-xl border border-purple border-opacity-20 space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <i className="ph-bold ph-video-camera text-purple mr-2"></i>
                      Informations Visioconférence
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Lien de visioconférence *</label>
                      <input
                        type="url"
                        name="visioLink"
                        value={formData.visioLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="https://zoom.us/j/... ou https://meet.google.com/..."
                        required={formData.formationType === 'visio'}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Date *</label>
                        <input
                          type="date"
                          name="visioDate"
                          value={formData.visioDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                          required={formData.formationType === 'visio'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Heure *</label>
                        <input
                          type="time"
                          name="visioTime"
                          value={formData.visioTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                          required={formData.formationType === 'visio'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Durée (minutes)</label>
                      <input
                        type="number"
                        name="visioDuration"
                        value={formData.visioDuration}
                        onChange={handleChange}
                        min="15"
                        step="15"
                        className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="Ex: 60"
                      />
                    </div>
                  </div>
                )}

                {/* Limitations (optionnel) */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <i className="ph-bold ph-lock text-purple mr-2"></i>
                    Limitations (Optionnel)
                  </h3>

                  <div className="space-y-4">
                    {/* Limitation de temps */}
                    <div className="p-4 bg-surface rounded-xl">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="hasTimeLimit"
                          checked={formData.hasTimeLimit}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-line text-purple focus:ring-purple"
                        />
                        <span className="ml-3 font-semibold">Limitation de temps</span>
                      </label>
                      <p className="text-xs text-secondary mt-1 ml-8">La formation sera retirée de la vente après une date</p>

                      {formData.hasTimeLimit && (
                        <div className="mt-3 ml-8">
                          <label className="block text-sm font-semibold mb-2">Date limite de vente</label>
                          <input
                            type="date"
                            name="timeLimitDate"
                            value={formData.timeLimitDate}
                            onChange={handleChange}
                            className="px-4 py-2 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                            required={formData.hasTimeLimit}
                          />
                        </div>
                      )}
                    </div>

                    {/* Limitation de quantité */}
                    <div className="p-4 bg-surface rounded-xl">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="hasQuantityLimit"
                          checked={formData.hasQuantityLimit}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-line text-purple focus:ring-purple"
                        />
                        <span className="ml-3 font-semibold">Limitation de quantité</span>
                      </label>
                      <p className="text-xs text-secondary mt-1 ml-8">Nombre maximum d'exemplaires vendus</p>

                      {formData.hasQuantityLimit && (
                        <div className="mt-3 ml-8">
                          <label className="block text-sm font-semibold mb-2">Nombre d'exemplaires maximum</label>
                          <input
                            type="number"
                            name="quantityLimit"
                            value={formData.quantityLimit}
                            onChange={handleChange}
                            min="1"
                            className="px-4 py-2 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                            placeholder="Ex: 50"
                            required={formData.hasQuantityLimit}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <i className="ph-bold ph-currency-euro text-purple mr-2"></i>
                    Tarification
                  </h3>

                  {/* Option Formation Gratuite */}
                  <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green border-opacity-20 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="isFree"
                        checked={formData.priceEntered === '0' || formData.priceEntered === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handlePriceChange({
                              priceMode: 'ttc',
                              priceEntered: '0',
                              priceTTC: 0,
                              priceNet: 0,
                              sumupFee: 0,
                              platformFee: 0,
                            });
                          } else {
                            handlePriceChange({
                              priceMode: 'ttc',
                              priceEntered: '',
                              priceTTC: 0,
                              priceNet: 0,
                              sumupFee: 0,
                              platformFee: 0,
                            });
                          }
                        }}
                        className="mt-1 w-5 h-5 text-green rounded border-gray-300 focus:ring-green"
                      />
                      <div className="flex-1">
                        <label htmlFor="isFree" className="font-semibold text-green-700 cursor-pointer flex items-center gap-2">
                          <i className="ph-bold ph-gift text-xl"></i>
                          Formation Gratuite
                        </label>
                        <p className="text-sm text-green-700 mt-2 leading-relaxed">
                          <strong>Les formations gratuites sont idéales pour promouvoir votre profil !</strong> Offrez du contenu de haute qualité gratuitement pour démontrer votre expertise et votre engagement. C'est un excellent moyen d'attirer de nouveaux élèves, de gagner en visibilité et d'augmenter vos ventes de formations payantes. Montrez votre savoir-faire et construisez votre réputation !
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Calculateur de prix (seulement si payant) */}
                  {formData.priceEntered !== '0' && formData.priceEntered !== 0 && (
                    <PriceCalculator
                      value={formData.priceEntered}
                      onChange={handlePriceChange}
                      mode={formData.priceMode}
                    />
                  )}
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="p-4 bg-red bg-opacity-10 border border-red border-opacity-20 rounded-xl text-red text-sm">
                    <i className="ph-bold ph-warning-circle mr-2"></i>
                    {error}
                  </div>
                )}

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-purple to-blue text-white rounded-xl font-semibold hover:from-purple hover:to-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ph ph-circle-notch animate-spin text-xl"></i>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-check-circle text-xl"></i>
                        Créer la formation
                      </>
                    )}
                  </button>

                  <Link
                    href="/formateur/dashboard"
                    className="px-8 py-4 bg-surface rounded-xl font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center"
                  >
                    Annuler
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
