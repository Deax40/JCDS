import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Composant pour afficher et gérer le statut de candidature formateur
function ApplicationStatus({ user, onStatusChange }) {
  const [isApproving, setIsApproving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!user.formateurApplicationStatus || user.formateurApplicationStatus === 'approved') {
    return <span className="text-xs text-secondary">-</span>;
  }

  const handleApprove = async () => {
    if (!confirm(`Approuver la candidature de ${user.prenom} ${user.nom} comme formateur ?`)) {
      return;
    }

    setIsApproving(true);
    try {
      const newRoles = [...(user.roles || [])];
      if (!newRoles.includes('formateur')) {
        newRoles.push('formateur');
      }

      const response = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          roles: newRoles,
        }),
      });

      if (response.ok) {
        await fetch('/api/admin/update-application-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            status: 'approved',
          }),
        });

        onStatusChange({
          ...user,
          roles: newRoles,
          formateurApplicationStatus: 'approved',
        });

        alert('Candidature approuvée avec succès !');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(`Rejeter la candidature de ${user.prenom} ${user.nom} ?`)) {
      return;
    }

    setIsApproving(true);
    try {
      const response = await fetch('/api/admin/update-application-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          status: 'rejected',
        }),
      });

      if (response.ok) {
        onStatusChange({
          ...user,
          formateurApplicationStatus: 'rejected',
        });

        alert('Candidature rejetée');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Erreur lors du rejet');
    } finally {
      setIsApproving(false);
    }
  };

  if (user.formateurApplicationStatus === 'pending') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-orange bg-opacity-10 text-orange rounded">
            En attente
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue hover:underline"
          >
            {showDetails ? 'Masquer' : 'Détails'}
          </button>
        </div>
        {showDetails && (
          <div className="text-xs space-y-2 p-2 bg-surface rounded">
            <p><strong>Raison:</strong> {user.formateurApplicationReason}</p>
            <p><strong>Type:</strong> {user.formateurApplicationFormationType}</p>
            <p><strong>Date:</strong> {new Date(user.formateurApplicationDate).toLocaleDateString('fr-FR')}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="px-3 py-1 bg-green text-white rounded text-xs hover:bg-opacity-90 disabled:opacity-50"
              >
                Approuver
              </button>
              <button
                onClick={handleReject}
                disabled={isApproving}
                className="px-3 py-1 bg-red text-white rounded text-xs hover:bg-opacity-90 disabled:opacity-50"
              >
                Rejeter
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (user.formateurApplicationStatus === 'rejected') {
    return (
      <span className="text-xs px-2 py-1 bg-red bg-opacity-10 text-red rounded">
        Rejetée
      </span>
    );
  }

  return <span className="text-xs text-secondary">-</span>;
}

// Composant pour gérer les rôles des utilisateurs
function RoleSelector({ user, onRoleChange }) {
  const [isChanging, setIsChanging] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(user.roles || [user.role]);

  const handleRoleToggle = async (role) => {
    setIsChanging(true);

    try {
      const newRoles = selectedRoles.includes(role)
        ? selectedRoles.filter(r => r !== role)
        : [...selectedRoles, role];

      if (newRoles.length === 0) {
        alert('Un utilisateur doit avoir au moins un rôle');
        setIsChanging(false);
        return;
      }

      const response = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          roles: newRoles,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedRoles(newRoles);
        onRoleChange({ ...user, roles: newRoles, role: newRoles[0] });
      } else {
        alert(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du rôle');
    } finally {
      setIsChanging(false);
    }
  };

  const roles = ['acheteur', 'formateur'];

  return (
    <div className="flex gap-2 items-center">
      {roles.map(role => {
        const isActive = selectedRoles.includes(role);
        return (
          <button
            key={role}
            onClick={() => handleRoleToggle(role)}
            disabled={isChanging}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              isActive
                ? role === 'formateur'
                  ? 'bg-purple text-white'
                  : 'bg-blue text-white'
                : 'bg-surface text-secondary hover:bg-opacity-70'
            } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isChanging ? (
              <i className="ph ph-circle-notch animate-spin"></i>
            ) : (
              role
            )}
          </button>
        );
      })}
    </div>
  );
}

// Modal pour éditer un utilisateur
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    prenom: user.prenom || '',
    nom: user.nom || '',
    pseudo: user.pseudo || '',
    email: user.email || '',
    telephone: user.telephone || '',
    genre: user.genre || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/edit-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Utilisateur modifié avec succès');
        onSave(data.user);
        onClose();
      } else {
        alert(data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la modification');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="heading6">Modifier l'utilisateur</h3>
          <button onClick={onClose} className="text-secondary hover:text-main">
            <i className="ph-bold ph-x text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pseudo</label>
            <input
              type="text"
              value={formData.pseudo}
              onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            >
              <option value="">Sélectionner...</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-surface rounded-lg hover:bg-opacity-80"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-purple text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('users');

  // Users tab
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Formations tab
  const [formations, setFormations] = useState([]);

  // Stats tab
  const [stats, setStats] = useState(null);

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (searchId) {
      const filtered = users.filter(u => u.id.toString().includes(searchId));
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchId, users]);

  const loadData = async () => {
    try {
      if (activeTab === 'users') {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        }
      } else if (activeTab === 'formations') {
        const response = await fetch('/api/admin/formations');
        const data = await response.json();
        if (response.ok) {
          setFormations(data.formations);
        }
      } else if (activeTab === 'stats') {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ? Cette action est irréversible.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        loadData();
      } else {
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleApproveDeletion = async (requestId, action) => {
    const message = action === 'approve'
      ? 'Confirmer la suppression définitive de cette formation ?'
      : 'Rejeter cette demande et remettre la formation en vente ?';

    if (!confirm(message)) return;

    const comment = prompt('Commentaire admin (optionnel):');

    try {
      const response = await fetch('/api/admin/approve-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          adminComment: comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        loadData();
      } else {
        alert(data.message || 'Erreur');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors du traitement');
    }
  };

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
                  <p className="text-sm text-secondary">Gestion complète de la plateforme</p>
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

          {/* Tabs */}
          <div className="container mx-auto px-4">
            <div className="flex gap-2 border-b border-line">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'users'
                    ? 'border-b-2 border-purple text-purple'
                    : 'text-secondary hover:text-main'
                }`}
              >
                <i className="ph-bold ph-users mr-2"></i>
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab('formations')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'formations'
                    ? 'border-b-2 border-purple text-purple'
                    : 'text-secondary hover:text-main'
                }`}
              >
                <i className="ph-bold ph-graduation-cap mr-2"></i>
                Formations
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'stats'
                    ? 'border-b-2 border-purple text-purple'
                    : 'text-secondary hover:text-main'
                }`}
              >
                <i className="ph-bold ph-chart-line mr-2"></i>
                Statistiques
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
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
                      <p className="heading5">{users.filter(u => u.roles?.includes('acheteur')).length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green bg-opacity-10 flex items-center justify-center">
                      <i className="ph-bold ph-storefront text-green text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Formateurs</p>
                      <p className="heading5">{users.filter(u => u.roles?.includes('formateur')).length}</p>
                    </div>
                  </div>
                </div>
              </div>

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
                        <th className="px-6 py-4 text-left text-sm font-semibold">Rôle</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Candidature</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
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
                            <td className="px-6 py-4">
                              <RoleSelector user={user} onRoleChange={(updatedUser) => {
                                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                                setFilteredUsers(filteredUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                              }} />
                            </td>
                            <td className="px-6 py-4">
                              <ApplicationStatus user={user} onStatusChange={(updatedUser) => {
                                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                                setFilteredUsers(filteredUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                              }} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingUser(user)}
                                  className="p-2 bg-blue bg-opacity-10 text-blue rounded-lg hover:bg-opacity-20"
                                  title="Modifier"
                                >
                                  <i className="ph-bold ph-pencil"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                                  className="p-2 bg-red bg-opacity-10 text-red rounded-lg hover:bg-opacity-20"
                                  title="Supprimer"
                                >
                                  <i className="ph-bold ph-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Formations Tab */}
          {activeTab === 'formations' && (
            <div className="bg-white rounded-2xl shadow">
              <div className="p-6 border-b border-line">
                <h2 className="heading6">Toutes les formations ({formations.length})</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Vendeur</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Prix</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ventes</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {formations.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-secondary">
                          Aucune formation
                        </td>
                      </tr>
                    ) : (
                      formations.map((formation) => (
                        <tr key={formation.id} className="hover:bg-surface transition">
                          <td className="px-6 py-4">
                            <span className="font-mono font-semibold text-purple">#{formation.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{formation.title}</p>
                              <p className="text-xs text-secondary">{formation.category}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            @{formation.seller.pseudo}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {formation.priceTTC === 0 ? 'Gratuit' : `${formation.priceTTC.toFixed(2)} €`}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {formation.quantitySold}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {formation.isActive ? (
                                <span className="text-xs px-2 py-1 bg-green bg-opacity-10 text-green rounded">
                                  Active
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-red bg-opacity-10 text-red rounded">
                                  Inactive
                                </span>
                              )}
                              {formation.deletionRequested && (
                                <span className="text-xs px-2 py-1 bg-orange bg-opacity-10 text-orange rounded">
                                  Suppression demandée
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {formation.deletionRequest && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveDeletion(formation.deletionRequest.id, 'approve')}
                                  className="px-3 py-1 bg-green text-white rounded text-xs hover:bg-opacity-90"
                                  title="Approuver la suppression"
                                >
                                  Approuver
                                </button>
                                <button
                                  onClick={() => handleApproveDeletion(formation.deletionRequest.id, 'reject')}
                                  className="px-3 py-1 bg-orange text-white rounded text-xs hover:bg-opacity-90"
                                  title="Rejeter la demande"
                                >
                                  Rejeter
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple bg-opacity-10 flex items-center justify-center">
                      <i className="ph-bold ph-users text-purple text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Utilisateurs</p>
                      <p className="heading5">{stats.users.total}</p>
                      <p className="text-xs text-secondary">
                        {stats.users.formateurs} formateurs, {stats.users.acheteurs} acheteurs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue bg-opacity-10 flex items-center justify-center">
                      <i className="ph-bold ph-graduation-cap text-blue text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Formations</p>
                      <p className="heading5">{stats.formations.total}</p>
                      <p className="text-xs text-secondary">
                        {stats.formations.active} actives
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green bg-opacity-10 flex items-center justify-center">
                      <i className="ph-bold ph-shopping-cart text-green text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Ventes</p>
                      <p className="heading5">{stats.sales.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange bg-opacity-10 flex items-center justify-center">
                      <i className="ph-bold ph-currency-eur text-orange text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Revenu Total</p>
                      <p className="heading5">{stats.sales.totalRevenue.toFixed(2)} €</p>
                      <p className="text-xs text-secondary">
                        CA: {stats.sales.totalSales.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Deletions */}
              {stats.formations.pendingDeletions > 0 && (
                <div className="bg-orange bg-opacity-10 border border-orange rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <i className="ph-bold ph-warning text-orange text-2xl"></i>
                    <div>
                      <p className="font-semibold text-orange">
                        {stats.formations.pendingDeletions} demande(s) de suppression en attente
                      </p>
                      <p className="text-sm text-secondary">
                        Consultez l'onglet Formations pour traiter ces demandes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Formations */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="heading6 mb-4">Top 5 Formations</h3>
                <div className="space-y-3">
                  {stats.topFormations.map((formation, index) => (
                    <div key={formation.id} className="flex items-center gap-4 p-3 bg-surface rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-purple text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{formation.title}</p>
                        <p className="text-xs text-secondary">par @{formation.sellerPseudo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple">{formation.sales} ventes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Formateurs */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="heading6 mb-4">Top 5 Formateurs</h3>
                <div className="space-y-3">
                  {stats.topFormateurs.map((formateur, index) => (
                    <div key={formateur.id} className="flex items-center gap-4 p-3 bg-surface rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{formateur.prenom} {formateur.nom}</p>
                        <p className="text-xs text-secondary">@{formateur.pseudo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green">{formateur.totalSales} ventes</p>
                        <p className="text-xs text-secondary">{formateur.formationsCount} formations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setFilteredUsers(filteredUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
          }}
        />
      )}
    </>
  );
}
