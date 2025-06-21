import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RestaurantList.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantList = () => {
  const { user, token } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  // Cuisines disponibles
  const cuisines = [
    'Toutes les cuisines',
    'Italienne',
    'Chinoise',
    'Japonaise',
    'Indienne',
    'Mexicaine',
    'Française',
    'Américaine',
    'Thaïlandaise',
    'Libanaise',
    'Végétarienne',
    'Fast-food'
  ];

  // Récupérer les restaurants
  useEffect(() => {
    fetchRestaurants();
    fetchFavorites();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map(fav => fav.restaurantId));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
    }
  };

  const toggleFavorite = async (restaurantId) => {
    try {
      const isFavorite = favorites.includes(restaurantId);
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(`${API_BASE_URL}/users/favorites/${restaurantId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (isFavorite) {
          setFavorites(favorites.filter(id => id !== restaurantId));
        } else {
          setFavorites([...favorites, restaurantId]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
    }
  };

  // Filtrer et trier les restaurants
  const filteredRestaurants = restaurants
    .filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCuisine = selectedCuisine === '' || selectedCuisine === 'Toutes les cuisines' || 
                            restaurant.cuisine === selectedCuisine;
      const matchesPrice = priceFilter === '' || restaurant.priceRange === priceFilter;
      
      return matchesSearch && matchesCuisine && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'deliveryTime':
          return (a.deliveryTime || 0) - (b.deliveryTime || 0);
        default:
          return 0;
      }
    });

  const getPriceRangeText = (priceRange) => {
    switch (priceRange) {
      case 'low': return '€';
      case 'medium': return '€€';
      case 'high': return '€€€';
      default: return '€';
    }
  };

  const getDeliveryTimeText = (deliveryTime) => {
    if (!deliveryTime) return '30-45 min';
    return `${deliveryTime} min`;
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
            <li><Link to="/user/restaurants" className="active">Restaurants</Link></li>
            <li><Link to="/user/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des restaurants...</p>
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
          <li><Link to="/user/restaurants" className="active">Restaurants</Link></li>
          <li><Link to="/user/orders">Mes Commandes</Link></li>
          <li><Link to="/user/favorites">Favoris</Link></li>
          <li><Link to="/user/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Restaurants</h1>
          <p>Découvrez nos restaurants partenaires</p>
        </div>

        {/* Filtres et recherche */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un restaurant ou une cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="filter-select"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les prix</option>
              <option value="low">€ (Économique)</option>
              <option value="medium">€€ (Moyen)</option>
              <option value="high">€€€ (Élevé)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Trier par nom</option>
              <option value="rating">Trier par note</option>
              <option value="distance">Trier par distance</option>
              <option value="deliveryTime">Trier par temps de livraison</option>
            </select>
          </div>
        </div>

        {/* Liste des restaurants */}
        <div className="restaurants-grid">
          {filteredRestaurants.length === 0 ? (
            <div className="no-results">
              <h3>Aucun restaurant trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            filteredRestaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-card">
                <div className="restaurant-image">
                  <img 
                    src={restaurant.image || '/default-restaurant.jpg'} 
                    alt={restaurant.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
                    }}
                  />
                  <button
                    className={`favorite-btn ${favorites.includes(restaurant._id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(restaurant._id)}
                    title={favorites.includes(restaurant._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {favorites.includes(restaurant._id) ? '❤️' : '🤍'}
                  </button>
                  {restaurant.isOpen ? (
                    <span className="status-badge open">Ouvert</span>
                  ) : (
                    <span className="status-badge closed">Fermé</span>
                  )}
                </div>

                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p className="cuisine-type">{restaurant.cuisine}</p>
                  
                  <div className="restaurant-meta">
                    <span className="rating">
                      {getRatingStars(restaurant.rating)} ({restaurant.rating || 'N/A'})
                    </span>
                    <span className="price-range">
                      {getPriceRangeText(restaurant.priceRange)}
                    </span>
                    <span className="delivery-time">
                      🚚 {getDeliveryTimeText(restaurant.deliveryTime)}
                    </span>
                  </div>

                  <p className="description">
                    {restaurant.description || 'Découvrez nos délicieux plats préparés avec soin.'}
                  </p>

                  <div className="restaurant-actions">
                    <Link 
                      to={`/user/restaurant/${restaurant._id}`} 
                      className="btn btn-primary"
                    >
                      Voir le menu
                    </Link>
                    <span className="min-order">
                      Min. {restaurant.minOrderAmount || 10}€
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredRestaurants.length > 0 && (
          <div className="results-info">
            <p>{filteredRestaurants.length} restaurant(s) trouvé(s)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList; 