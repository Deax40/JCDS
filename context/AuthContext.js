import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger le panier depuis l'API
  const loadCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Charger les favoris depuis l'API
  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.favorites || []);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Charger panier et favoris quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadCart();
      loadWishlist();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  // Inscription
  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          telephone: userData.telephone,
          nom: userData.nom,
          prenom: userData.prenom,
          pseudo: userData.pseudo,
          password: userData.password,
          genre: userData.genre,
          role: userData.role || 'acheteur'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      // Connecter automatiquement l'utilisateur
      const userToSave = { ...data.user, purchases: [] };
      setUser(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));

      return { success: true, user: userToSave };
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      // Sauvegarder l'utilisateur en session
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur connexion:', error);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  // Mettre à jour le pseudo
  const updatePseudo = async (newPseudo) => {
    try {
      const response = await fetch('/api/auth/update-pseudo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          newPseudo: newPseudo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      // Mettre à jour l'utilisateur en session
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour pseudo:', error);
      return { success: false, message: 'Erreur lors de la mise à jour' };
    }
  };

  // Ajouter au panier (via API)
  const addToCart = async (formation) => {
    if (!user) {
      return { success: false, message: 'Veuillez vous connecter' };
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId: formation.id }),
      });

      const data = await response.json();
      if (response.ok) {
        // Reload cart
        loadCart();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Erreur lors de l\'ajout au panier' };
    }
  };

  // Retirer du panier (via API)
  const removeFromCart = async (formationId) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId }),
      });

      if (response.ok) {
        loadCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false };
    }
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Ajouter aux favoris (via API)
  const addToWishlist = async (formation) => {
    if (!user) {
      return { success: false, message: 'Veuillez vous connecter' };
    }

    try {
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId: formation.id }),
      });

      const data = await response.json();
      if (response.ok) {
        loadWishlist();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Erreur lors de l\'ajout aux favoris' };
    }
  };

  // Retirer des favoris (via API)
  const removeFromWishlist = async (formationId) => {
    try {
      const response = await fetch('/api/favorites/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId }),
      });

      if (response.ok) {
        loadWishlist();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false };
    }
  };

  // Vérifier si dans les favoris
  const isInWishlist = (formationId) => {
    return wishlist.some(item => item.formation?.id === formationId || item.id === formationId);
  };

  // Vérifier si dans le panier
  const isInCart = (formationId) => {
    return cart.some(item => item.formation?.id === formationId || item.id === formationId);
  };

  // Enregistrer un achat
  const recordPurchase = (formations) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const purchase = {
        id: Date.now(),
        formations: formations,
        total: formations.reduce((sum, f) => sum + (f.promo_price || f.price), 0),
        date: new Date().toISOString()
      };

      const updatedUsers = users.map(u =>
        u.id === user.id
          ? { ...u, purchases: [...(u.purchases || []), purchase] }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      const updatedUser = { ...user, purchases: [...(user.purchases || []), purchase] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Vider le panier après achat
      clearCart();

      return { success: true };
    } catch (error) {
      console.error('Erreur enregistrement achat:', error);
      return { success: false, message: 'Erreur lors de l\'enregistrement de l\'achat' };
    }
  };

  const value = {
    user,
    loading,
    cart,
    wishlist,
    register,
    login,
    logout,
    updatePseudo,
    addToCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInCart,
    recordPurchase
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
