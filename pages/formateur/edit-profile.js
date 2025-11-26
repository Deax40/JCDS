import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';
import AvatarPicker from '../../components/AvatarPicker';
import { useAuth } from '../../context/AuthContext';

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    avatarColor: 'purple',
    avatarShape: 'circle',
    avatarUrl: '',
    bio: '',
    competences: [],
    website: '',
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
  });
  const [competenceInput, setCompetenceInput] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/formateur/edit-profile');
      return;
    }

    if (user && (!user.roles || !user.roles.includes('formateur'))) {
      router.push('/mon-compte');
      return;
    }

    loadProfile();
  }, [user, router]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/formateur/profile', {
        credentials: 'include', // Important pour envoyer les cookies
      });
      if (response.ok) {
        const data = await response.json();
        setProfile({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          avatarColor: data.profile.avatarColor || 'purple',
          avatarShape: data.profile.avatarShape || 'circle',
          avatarUrl: data.profile.avatar || '',
          bio: data.profile.bio || '',
          competences: data.profile.competences || [],
          website: data.profile.website || '',
          instagram: data.profile.socials.instagram || '',
          twitter: data.profile.socials.twitter || '',
          facebook: data.profile.socials.facebook || '',
          linkedin: data.profile.socials.linkedin || '',
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors du chargement du profil');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/formateur/upload-photo', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({ ...profile, avatarUrl: data.url });
        alert('Photo téléchargée avec succès !');
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erreur lors du téléchargement de la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/formateur/update-profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert('Profil mis à jour avec succès !');
        router.push('/formateur/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const addCompetence = () => {
    if (competenceInput.trim() && !profile.competences.includes(competenceInput.trim())) {
      if (profile.competences.length >= 20) {
        alert('Maximum 20 compétences autorisées');
        return;
      }
      setProfile({
        ...profile,
        competences: [...profile.competences, competenceInput.trim()],
      });
      setCompetenceInput('');
    }
  };

  const removeCompetence = (index) => {
    setProfile({
      ...profile,
      competences: profile.competences.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompetence();
    }
  };

  if (!user || !user.roles || !user.roles.includes('formateur')) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Modifier mon Profil Formateur - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        {/* Header */}
        <div className="bg-gradient-to-br from-purple to-blue text-white py-12">
          <div className="container">
            <Link href="/formateur/dashboard" className="inline-flex items-center gap-2 text-white text-opacity-90 hover:text-opacity-100 mb-4">
              <i className="ph-bold ph-arrow-left"></i>
              Retour au dashboard
            </Link>
            <h1 className="heading3">Modifier mon Profil Formateur</h1>
            <p className="text-white text-opacity-90 mt-2">
              Personnalisez votre profil pour vous présenter aux étudiants
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 bg-surface min-h-screen">
          <div className="container max-w-4xl">
            {loading ? (
              <div className="text-center py-20">
                <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
                <p className="text-secondary">Chargement...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Nom et Prénom */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-semibold mb-2">
                      Prénom <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-line rounded-lg focus:border-purple focus:outline-none"
                      placeholder="Votre prénom"
                      required
                      minLength={2}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Nom <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-line rounded-lg focus:border-purple focus:outline-none"
                      placeholder="Votre nom"
                      required
                      minLength={2}
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="border-t border-line my-8"></div>

                {/* Avatar personnalisé */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4 text-lg">
                    <i className="ph-bold ph-user-circle text-purple mr-2"></i>
                    Avatar personnalisé
                  </h3>
                  <AvatarPicker
                    currentColor={profile.avatarColor}
                    currentShape={profile.avatarShape}
                    initials={`${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`}
                    onColorChange={(color) => setProfile({ ...profile, avatarColor: color })}
                    onShapeChange={(shape) => setProfile({ ...profile, avatarShape: shape })}
                  />
                </div>

                <div className="border-t border-line my-8"></div>

                {/* Photo de profil (formateurs uniquement) */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-lg">
                    <i className="ph-bold ph-camera text-purple mr-2"></i>
                    Photo de profil
                    <span className="text-secondary font-normal ml-2 text-sm">(Réservé aux formateurs)</span>
                  </h3>
                  <p className="text-sm text-secondary mb-4">
                    Téléchargez une photo de profil professionnelle pour donner confiance à vos futurs étudiants.
                  </p>

                  {profile.avatarUrl && (
                    <div className="mb-4">
                      <img
                        src={profile.avatarUrl}
                        alt="Photo de profil"
                        className="w-32 h-32 rounded-full object-cover border-4 border-surface"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <label className="button-main cursor-pointer">
                      <i className="ph-bold ph-upload mr-2"></i>
                      {uploading ? 'Téléchargement...' : 'Choisir une photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {profile.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, avatarUrl: '' })}
                        className="px-4 py-2 border border-red text-red rounded-lg hover:bg-red hover:bg-opacity-10 transition"
                      >
                        <i className="ph-bold ph-trash mr-2"></i>
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-secondary mt-2">
                    Format accepté : JPG, PNG. Taille max : 5 MB. Recommandé : 400x400px
                  </p>
                </div>

                <div className="border-t border-line my-8"></div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Bio
                    <span className="text-secondary font-normal ml-2 text-sm">(Optionnel)</span>
                  </label>
                  <p className="text-sm text-secondary mb-2">
                    Présentez-vous en quelques mots. Parlez de votre expérience, de vos passions et de ce qui vous motive.
                  </p>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-line rounded-lg focus:border-purple focus:outline-none resize-none"
                    rows="5"
                    maxLength="1000"
                    placeholder="Ex: Formateur passionné depuis 10 ans, spécialisé dans le développement web et le design..."
                  ></textarea>
                  <p className="text-xs text-secondary mt-1 text-right">
                    {profile.bio.length}/1000 caractères
                  </p>
                </div>

                {/* Compétences */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Compétences
                    <span className="text-secondary font-normal ml-2 text-sm">(Optionnel, max 20)</span>
                  </label>
                  <p className="text-sm text-secondary mb-2">
                    Ajoutez vos domaines d'expertise pour que les étudiants sachent ce que vous maîtrisez.
                  </p>

                  {/* Input pour ajouter */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={competenceInput}
                      onChange={(e) => setCompetenceInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none"
                      placeholder="Ex: React, Python, Marketing digital..."
                      maxLength="50"
                    />
                    <button
                      type="button"
                      onClick={addCompetence}
                      className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-opacity-90 transition"
                      disabled={!competenceInput.trim() || profile.competences.length >= 20}
                    >
                      <i className="ph-bold ph-plus"></i>
                    </button>
                  </div>

                  {/* Liste des compétences */}
                  {profile.competences.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.competences.map((comp, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-purple bg-opacity-10 text-purple rounded-full flex items-center gap-2"
                        >
                          <span className="text-sm">{comp}</span>
                          <button
                            type="button"
                            onClick={() => removeCompetence(index)}
                            className="hover:text-red transition"
                          >
                            <i className="ph-bold ph-x text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-line my-8"></div>

                {/* Site web */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    <i className="ph-bold ph-globe text-purple mr-2"></i>
                    Site Web
                    <span className="text-secondary font-normal ml-2 text-sm">(Optionnel)</span>
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none"
                    placeholder="https://votresite.com"
                  />
                </div>

                {/* Réseaux sociaux */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">
                    <i className="ph-bold ph-share-network text-purple mr-2"></i>
                    Réseaux Sociaux
                    <span className="text-secondary font-normal ml-2 text-sm">(Optionnel)</span>
                  </h3>
                  <p className="text-sm text-secondary mb-4">
                    Ajoutez vos profils pour permettre aux étudiants de vous suivre sur vos réseaux.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <i className="ph-bold ph-instagram-logo mr-2"></i>
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={profile.instagram}
                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                        className="w-full px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none"
                        placeholder="https://instagram.com/votreprofil"
                      />
                    </div>

                    {/* Twitter / X */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <i className="ph-bold ph-x-logo mr-2"></i>
                        X (Twitter)
                      </label>
                      <input
                        type="url"
                        value={profile.twitter}
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                        className="w-full px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none"
                        placeholder="https://x.com/votreprofil"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <i className="ph-bold ph-facebook-logo mr-2"></i>
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={profile.facebook}
                        onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                        className="w-full px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none"
                        placeholder="https://facebook.com/votreprofil"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <i className="ph-bold ph-linkedin-logo mr-2"></i>
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        className="w-full px-4 py-2 border border-line rounded-lg focus:border-purple focus:outline-none"
                        placeholder="https://linkedin.com/in/votreprofil"
                      />
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-6 border-t border-line">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 button-main disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <i className="ph ph-circle-notch animate-spin mr-2"></i>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-check mr-2"></i>
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                  <Link
                    href="/formateur/dashboard"
                    className="px-6 py-3 border border-line rounded-lg hover:bg-surface transition text-center"
                  >
                    Annuler
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
