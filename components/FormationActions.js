/**
 * Composant FormationActions
 *
 * Boutons d'action pour une formation (panier, favoris)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FormationActions({
  formationId,
  className = '',
  onCartUpdate = () => {},
  onFavoriteUpdate = () => {},
}) {
  const { user } = useAuth();
  const [inCart, setInCart] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && formationId) {
      checkStatus();
    }
  }, [user, formationId]);

  const checkStatus = async () => {
    try {
      // Check cart
      const cartRes = await fetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setInCart(cartData.items.some(item => item.formation.id === parseInt(formationId)));
      }

      // Check favorites
      const favRes = await fetch('/api/favorites');
      if (favRes.ok) {
        const favData = await favRes.json();
        setInFavorites(favData.favorites.some(fav => fav.formation.id === parseInt(formationId)));
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Veuillez vous connecter pour ajouter au panier');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId }),
      });

      const data = await response.json();

      if (response.ok) {
        setInCart(true);
        onCartUpdate();
        alert('Formation ajoutée au panier');
      } else {
        alert(data.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId }),
      });

      const data = await response.json();

      if (response.ok) {
        setInCart(false);
        onCartUpdate();
      } else {
        alert(data.message || 'Erreur lors du retrait du panier');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Erreur lors du retrait du panier');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    setLoading(true);
    try {
      const endpoint = inFavorites ? '/api/favorites/remove' : '/api/favorites/add';
      const method = inFavorites ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formationId }),
      });

      const data = await response.json();

      if (response.ok) {
        setInFavorites(!inFavorites);
        onFavoriteUpdate();
      } else {
        alert(data.message || 'Erreur lors de la mise à jour des favoris');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Erreur lors de la mise à jour des favoris');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`p-2 rounded-lg transition-all ${
          inFavorites
            ? 'bg-red bg-opacity-10 text-red hover:bg-opacity-20'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={inFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <i className={`ph-bold ${inFavorites ? 'ph-heart-fill' : 'ph-heart'} text-xl`}></i>
      </button>

      {/* Cart Button */}
      {inCart ? (
        <button
          onClick={handleRemoveFromCart}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-green bg-opacity-10 text-green rounded-lg hover:bg-opacity-20 transition font-semibold text-sm"
        >
          <i className="ph-bold ph-check mr-2"></i>
          Dans le panier
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-purple text-white rounded-lg hover:bg-opacity-90 transition font-semibold text-sm"
        >
          <i className="ph-bold ph-shopping-cart mr-2"></i>
          Ajouter au panier
        </button>
      )}
    </div>
  );
}
