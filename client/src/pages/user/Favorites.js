import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Favorites.css';

const API_BASE_URL = 'http://localhost:5000';

const Favorites = () => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav._id !== favoriteId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  // Filtrer les favoris
  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.dish?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'restaurants' ? favorite.type === 'restaurant' : favorite.type === 'dish';
    return matchesSearch && matchesTab;
  });

  const restaurantFavorites = filteredFavorites.filter(fav => fav.type === 'restaurant');
  const dishFavorites = filteredFavorites.filter(fav => fav.type === 'dish');

  const getPriceRangeText = (priceRange) => {
    switch (priceRange) {
      case 'low': return '€';
      case 'medium': return '€€';
      case 'high': return '€€€';
      default: return '€';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    return stars.join('');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="sidebar">
          <h3>Menu Client</h3>
          <ul className="sidebar-menu">
            <li><Link to="/user/dashboard">Accueil</Link></li>
            <li><Link to="/user/restaurants">Restaurants</Link></li>
            <li><Link to="/user/orders">Mes Commandes</Link></li>
            <li><Link to="/user/favorites" className="active">Favoris</Link></li>
            <li><Link to="/user/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos favoris...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Client</h3>
        <ul className="sidebar-menu">
          <li><Link to="/user/dashboard">Accueil</Link></li>
          <li><Link to="/user/restaurants">Restaurants</Link></li>
          <li><Link to="/user/orders">Mes Commandes</Link></li>
          <li><Link to="/user/favorites" className="active">Favoris</Link></li>
          <li><Link to="/user/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Mes Favoris</h1>
          <p>Retrouvez vos restaurants et plats préférés</p>
        </div>

        {/* Barre de recherche */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Rechercher dans vos favoris..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Onglets */}
        <div className="tabs-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'restaurants' ? 'active' : ''}`}
              onClick={() => setActiveTab('restaurants')}
            >
              🏪 Restaurants ({restaurantFavorites.length})
            </button>
            <button
              className={`tab ${activeTab === 'dishes' ? 'active' : ''}`}
              onClick={() => setActiveTab('dishes')}
            >
              🍽️ Plats ({dishFavorites.length})
            </button>
          </div>
        </div>

        {/* Contenu des favoris */}
        <div className="favorites-content">
          {activeTab === 'restaurants' ? (
            <div className="restaurants-favorites">
              {restaurantFavorites.length === 0 ? (
                <div className="no-favorites">
                  <div className="no-favorites-icon">🏪</div>
                  <h3>Aucun restaurant favori</h3>
                  <p>
                    {searchTerm 
                      ? 'Aucun restaurant ne correspond à votre recherche'
                      : 'Vous n\'avez pas encore ajouté de restaurants à vos favoris'
                    }
                  </p>
                  {!searchTerm && (
                    <Link to="/user/restaurants" className="btn btn-primary">
                      Découvrir des restaurants
                    </Link>
                  )}
                </div>
              ) : (
                <div className="favorites-grid">
                  {restaurantFavorites.map(favorite => (
                    <div key={favorite._id} className="favorite-card restaurant-card">
                      <div className="favorite-image">
                        <img 
                          src={favorite.restaurant?.image || 'https://via.placeholder.com/300x200?text=Restaurant'} 
                          alt={favorite.restaurant?.name}
                        />
                        <button
                          className="remove-favorite-btn"
                          onClick={() => removeFavorite(favorite._id)}
                          title="Retirer des favoris"
                        >
                          ❌
                        </button>
                        {favorite.restaurant?.isOpen ? (
                          <span className="status-badge open">Ouvert</span>
                        ) : (
                          <span className="status-badge closed">Fermé</span>
                        )}
                      </div>

                      <div className="favorite-info">
                        <h3>{favorite.restaurant?.name}</h3>
                        <p className="cuisine-type">{favorite.restaurant?.cuisine}</p>
                        
                        <div className="restaurant-meta">
                          <span className="rating">
                            {getRatingStars(favorite.restaurant?.rating)} ({favorite.restaurant?.rating || 'N/A'})
                          </span>
                          <span className="price-range">
                            {getPriceRangeText(favorite.restaurant?.priceRange)}
                          </span>
                          <span className="delivery-time">
                            🚚 {favorite.restaurant?.deliveryTime || 30} min
                          </span>
                        </div>

                        <p className="description">
                          {favorite.restaurant?.description || 'Découvrez nos délicieux plats préparés avec soin.'}
                        </p>

                        <div className="favorite-actions">
                          <Link 
                            to={`/user/restaurant/${favorite.restaurant?._id}`} 
                            className="btn btn-primary"
                          >
                            Voir le menu
                          </Link>
                          <span className="min-order">
                            Min. {favorite.restaurant?.minOrderAmount || 10}€
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="dishes-favorites">
              {dishFavorites.length === 0 ? (
                <div className="no-favorites">
                  <div className="no-favorites-icon">🍽️</div>
                  <h3>Aucun plat favori</h3>
                  <p>
                    {searchTerm 
                      ? 'Aucun plat ne correspond à votre recherche'
                      : 'Vous n\'avez pas encore ajouté de plats à vos favoris'
                    }
                  </p>
                  {!searchTerm && (
                    <Link to="/user/restaurants" className="btn btn-primary">
                      Découvrir des plats
                    </Link>
                  )}
                </div>
              ) : (
                <div className="favorites-grid">
                  {dishFavorites.map(favorite => (
                    <div key={favorite._id} className="favorite-card dish-card">
                      <div className="favorite-image">
                        <img 
                          src={favorite.dish?.images?.[0] || 'https://via.placeholder.com/300x200?text=Plat'} 
                          alt={favorite.dish?.name}
                        />
                        <button
                          className="remove-favorite-btn"
                          onClick={() => removeFavorite(favorite._id)}
                          title="Retirer des favoris"
                        >
                          ❌
                        </button>
                        {favorite.dish?.isDailySpecial && (
                          <span className="badge special">Plat du jour</span>
                        )}
                        {favorite.dish?.isPromotion && (
                          <span className="badge promotion">-{favorite.dish?.discountPercentage}%</span>
                        )}
                      </div>

                      <div className="favorite-info">
                        <h3>{favorite.dish?.name}</h3>
                        <p className="restaurant-name">
                          {favorite.dish?.restaurant?.name}
                        </p>
                        
                        <div className="dish-meta">
                          <span className="price">
                            {favorite.dish?.isPromotion ? (
                              <>
                                <span className="original-price">{favorite.dish?.basePrice}€</span>
                                <span className="discounted-price">
                                  {(favorite.dish?.basePrice * (1 - favorite.dish?.discountPercentage / 100)).toFixed(2)}€
                                </span>
                              </>
                            ) : (
                              <span>{favorite.dish?.basePrice}€</span>
                            )}
                          </span>
                          <span className="preparation-time">
                            ⏱️ {favorite.dish?.preparationTime || 15} min
                          </span>
                        </div>

                        <p className="description">
                          {favorite.dish?.description || 'Délicieux plat préparé avec soin.'}
                        </p>

                        <div className="favorite-actions">
                          <Link 
                            to={`/user/restaurant/${favorite.dish?.restaurant?._id}`} 
                            className="btn btn-primary"
                          >
                            Commander
                          </Link>
                          <span className="category">
                            {favorite.dish?.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Résumé */}
        {filteredFavorites.length > 0 && (
          <div className="favorites-summary">
            <p>
              {filteredFavorites.length} favori(s) trouvé(s)
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 