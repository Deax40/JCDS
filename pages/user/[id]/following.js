import Head from 'next/head';
import HeaderAnvogue from '../../../components/HeaderAnvogue';
import FooterAnvogue from '../../../components/FooterAnvogue';
import UserAvatar from '../../../components/UserAvatar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';

export default function FollowingPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [targetUser, setTargetUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user && user.id === parseInt(id);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load user info
      const userRes = await fetch(`/api/users/${id}`);
      if (userRes.ok) {
        const data = await userRes.json();
        setTargetUser(data.user);
      }

      // Load following
      const followingRes = await fetch(`/api/subscriptions/following/${id}`);
      if (followingRes.ok) {
        const data = await followingRes.json();
        setFollowing(data.following || []);
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
          <title>Abonnements - FormationPlace</title>
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
        <title>Abonnements de {targetUser?.pseudo || 'Utilisateur'} - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="bg-surface min-h-screen py-12 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link
                  href={isOwnProfile ? '/dashboard' : `/user/${id}`}
                  className="inline-flex items-center gap-2 text-secondary hover:text-purple transition mb-4"
                >
                  <i className="ph-bold ph-arrow-left"></i>
                  <span>Retour</span>
                </Link>

                {targetUser && (
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar
                      user={{
                        firstName: targetUser.firstName,
                        lastName: targetUser.lastName,
                        pseudo: targetUser.pseudo,
                        avatar: targetUser.avatar,
                        avatarColor: targetUser.avatarColor,
                        avatarShape: targetUser.avatarShape,
                      }}
                      size="lg"
                    />
                    <div>
                      <h1 className="heading3">
                        Abonnements {isOwnProfile ? '' : `de ${targetUser.pseudo}`}
                      </h1>
                      <p className="text-secondary">
                        {following.length} formateur{following.length > 1 ? 's' : ''} suivi{following.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Following List */}
              <div className="bg-white rounded-2xl p-6 shadow">
                {following.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="ph-bold ph-user-list text-6xl text-gray-300 mb-4 block"></i>
                    <p className="text-secondary mb-4">
                      {isOwnProfile ? 'Vous ne suivez' : 'Cet utilisateur ne suit'} aucun formateur pour le moment
                    </p>
                    {isOwnProfile && (
                      <Link href="/formateurs" className="button-main">
                        Découvrir les formateurs
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {following.map((formateurData) => (
                      <Link
                        key={formateurData.id}
                        href={`/formateur/${formateurData.id}`}
                        className="block p-4 border border-gray-100 rounded-xl hover:border-purple hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-4 mb-3">
                          <UserAvatar
                            user={{
                              firstName: formateurData.firstName,
                              lastName: formateurData.lastName,
                              pseudo: formateurData.pseudo,
                              avatar: formateurData.avatar,
                              avatarColor: formateurData.avatarColor,
                              avatarShape: formateurData.avatarShape,
                            }}
                            size="lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{formateurData.pseudo}</h3>
                            <p className="text-sm text-secondary mb-2">
                              {formateurData.firstName} {formateurData.lastName}
                            </p>
                            {formateurData.bio && (
                              <p className="text-sm text-secondary line-clamp-2">{formateurData.bio}</p>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-surface rounded-lg p-2 text-center">
                            <p className="text-xs text-secondary mb-1">Formations</p>
                            <p className="font-bold text-purple">{formateurData.totalFormations}</p>
                          </div>
                          <div className="bg-surface rounded-lg p-2 text-center">
                            <p className="text-xs text-secondary mb-1">Abonnés</p>
                            <p className="font-bold text-blue">{formateurData.followersCount}</p>
                          </div>
                        </div>

                        <p className="text-xs text-secondary">
                          Abonné depuis le {formatDate(formateurData.followingSince)}
                        </p>
                      </Link>
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
