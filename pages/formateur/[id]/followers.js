import Head from 'next/head';
import HeaderAnvogue from '../../../components/HeaderAnvogue';
import FooterAnvogue from '../../../components/FooterAnvogue';
import UserAvatar from '../../../components/UserAvatar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function FollowersPage() {
  const router = useRouter();
  const { id } = router.query;

  const [formateur, setFormateur] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load formateur info
      const formateurRes = await fetch(`/api/formateurs/${id}`);
      if (formateurRes.ok) {
        const data = await formateurRes.json();
        setFormateur(data.formateur);
      }

      // Load followers
      const followersRes = await fetch(`/api/subscriptions/followers/${id}`);
      if (followersRes.ok) {
        const data = await followersRes.json();
        setFollowers(data.followers || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Abonnés - FormationPlace</title>
        </Head>
        <div className="overflow-x-hidden">
          <HeaderAnvogue />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <i className="ph ph-circle-notch animate-spin text-purple text-6xl mb-4"></i>
              <p className="text-secondary">Chargement...</p>
            </div>
          </div>
          <FooterAnvogue />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Abonnés de {formateur?.pseudo || 'Formateur'} - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="bg-surface min-h-screen py-12 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link
                  href={`/formateur/${id}`}
                  className="inline-flex items-center gap-2 text-secondary hover:text-purple transition mb-4"
                >
                  <i className="ph-bold ph-arrow-left"></i>
                  <span>Retour au profil</span>
                </Link>

                {formateur && (
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar
                      user={{
                        firstName: formateur.firstName,
                        lastName: formateur.lastName,
                        pseudo: formateur.pseudo,
                        avatar: formateur.avatar,
                        avatarColor: formateur.avatarColor,
                        avatarShape: formateur.avatarShape,
                      }}
                      size="lg"
                    />
                    <div>
                      <h1 className="heading3">Abonnés de {formateur.pseudo}</h1>
                      <p className="text-secondary">{followers.length} abonné{followers.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Followers List */}
              <div className="bg-white rounded-2xl p-6 shadow">
                {followers.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="ph-bold ph-users text-6xl text-gray-300 mb-4 block"></i>
                    <p className="text-secondary">Aucun abonné pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followers.map((follower) => (
                      <div
                        key={follower.id}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-purple hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            user={{
                              firstName: follower.firstName,
                              lastName: follower.lastName,
                              pseudo: follower.pseudo,
                              avatar: follower.avatar,
                              avatarColor: follower.avatarColor,
                              avatarShape: follower.avatarShape,
                            }}
                            size="md"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{follower.pseudo}</h3>
                              {follower.isFormateur && (
                                <span className="px-2 py-1 bg-purple bg-opacity-10 text-purple text-xs rounded-full font-semibold">
                                  Formateur
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-secondary">
                              {follower.firstName} {follower.lastName}
                            </p>
                            <p className="text-xs text-secondary mt-1">
                              Abonné depuis le {formatDate(follower.followedSince)}
                            </p>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        {follower.isFormateur && (
                          <Link
                            href={`/formateur/${follower.id}`}
                            className="px-4 py-2 bg-purple bg-opacity-10 text-purple rounded-lg hover:bg-opacity-20 transition font-semibold text-sm"
                          >
                            Voir le profil
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
