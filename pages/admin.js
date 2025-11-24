import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Identifiants admin bateau
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    // Charger les utilisateurs depuis l'API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        }
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filtrer les utilisateurs par ID
    if (searchId) {
      const filtered = users.filter(u => u.id.toString().includes(searchId));
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchId, users]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === ADMIN_USERNAME && loginData.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants incorrects');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin - FormationPlace</title>
        </Head>

        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <i className="ph-bold ph-shield-check text-6xl text-purple mb-4"></i>
              <h1 className="heading3 mb-2">Administration</h1>
              <p className="text-secondary">Connexion requise</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Identifiant</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="admin123"
                />
              </div>

              <button type="submit" className="button-main w-full">
                Se connecter
              </button>

              <div className="text-center mt-4 pt-4 border-t border-line">
                <p className="text-xs text-secondary">
                  Identifiants par défaut :<br />
                  admin / admin123
                </p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-purple hover:underline">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard Admin - FormationPlace</title>
      </Head>

      <div className="min-h-screen bg-surface">
        {/* Header Admin */}
        <div className="bg-white border-b border-line">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <i className="ph-bold ph-shield-check text-3xl text-purple"></i>
                <div>
                  <h1 className="heading5">Dashboard Admin</h1>
                  <p className="text-sm text-secondary">Gestion des utilisateurs</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-sm text-purple hover:underline">
                  Retour au site
                </Link>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    router.push('/');
                  }}
                  className="text-sm text-red hover:underline"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Statistiques */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple bg-opacity-10 flex items-center justify-center">
                  <i className="ph-bold ph-users text-purple text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-secondary mb-1">Total Utilisateurs</p>
                  <p className="heading5">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue bg-opacity-10 flex items-center justify-center">
                  <i className="ph-bold ph-shopping-bag text-blue text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-secondary mb-1">Acheteurs</p>
                  <p className="heading5">{users.filter(u => u.role === 'acheteur').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green bg-opacity-10 flex items-center justify-center">
                  <i className="ph-bold ph-storefront text-green text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-secondary mb-1">Vendeurs</p>
                  <p className="heading5">{users.filter(u => u.role === 'vendeur').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recherche */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-secondary"></i>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Rechercher par ID utilisateur..."
                  className="w-full pl-12 pr-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <button
                onClick={() => setSearchId('')}
                className="px-6 py-3 bg-surface rounded-xl hover:bg-opacity-80 transition"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-white rounded-2xl shadow">
            <div className="p-6 border-b border-line">
              <h2 className="heading6">
                Liste des utilisateurs ({filteredUsers.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nom</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Pseudo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Téléphone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rôle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-secondary">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface transition">
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-purple">#{user.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{user.prenom} {user.nom}</p>
                            <p className="text-xs text-secondary">{user.genre}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">@{user.pseudo}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">{user.email}</td>
                        <td className="px-6 py-4 text-sm">{user.telephone}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            user.role === 'vendeur'
                              ? 'bg-purple bg-opacity-10 text-purple'
                              : 'bg-blue bg-opacity-10 text-blue'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
