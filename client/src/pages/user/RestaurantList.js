import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RestaurantList.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantList = () => {
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    deliveryTime: '',
    priceRange: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('recommended');

  const categories = [
    { id: 'all', name: 'Tous', icon: 'restaurant' },
    { id: 'Français', name: 'Français', icon: 'restaurant_menu' },
    { id: 'Italien', name: 'Italien', icon: 'local_pizza' },
    { id: 'Japonais', name: 'Japonais', icon: 'ramen_dining' },
    { id: 'Fast Food', name: 'Fast Food', icon: 'fastfood' },
    { id: 'Indien', name: 'Indien', icon: 'curry' },
    { id: 'Café', name: 'Café', icon: 'local_cafe' }
  ];

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des restaurants');
      }

      const data = await response.json();
      console.log('✅ Restaurants chargés depuis l\'API:', data);
      
      // Transformer les données si nécessaire
      const transformedRestaurants = Array.isArray(data) ? data : [];
      setRestaurants(transformedRestaurants);
    } catch (err) {
      console.error('❌ Erreur chargement restaurants:', err);
      setError('Erreur lors du chargement des restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      rating: '',
      deliveryTime: '',
      priceRange: '',
      search: ''
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.category && filters.category !== 'all' && restaurant.category !== filters.category) return false;
    if (filters.rating && (restaurant.rating || 0) < parseFloat(filters.rating)) return false;
    if (filters.search && !restaurant.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'deliveryTime':
        const timeA = parseInt(a.deliveryTime?.split('-')[0]) || 0;
        const timeB = parseInt(b.deliveryTime?.split('-')[0]) || 0;
        return timeA - timeB;
      case 'deliveryFee':
        return (a.deliveryFee || 0) - (b.deliveryFee || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="restaurant-list-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-list-page">
        <div className="error-container">
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button onClick={fetchRestaurants} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-list-page">
      {/* Header avec recherche */}
      <div className="page-header">
        <div className="container">
          <h1>Restaurants près de vous</h1>
          <div className="search-section">
            <div className="search-bar">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Rechercher un restaurant..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="sort-dropdown">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommandé</option>
                <option value="rating">Note</option>
                <option value="deliveryTime">Temps de livraison</option>
                <option value="deliveryFee">Frais de livraison</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="content-layout">
            {/* Sidebar avec filtres */}
            <aside className="filters-sidebar">
              <div className="filters-container">
                <div className="filters-header">
                  <h3>Filtres</h3>
                  <button onClick={clearFilters} className="clear-filters">
                    <span className="material-icons">clear</span>
                    Effacer
                  </button>
                </div>

                {/* Catégories */}
                <div className="filter-section">
                  <h4>Catégories</h4>
                  <div className="category-filters">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`category-filter ${filters.category === category.id ? 'active' : ''}`}
                        onClick={() => handleFilterChange('category', category.id)}
                      >
                        <span className="material-icons">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note minimale */}
                <div className="filter-section">
                  <h4>Note minimale</h4>
                  <div className="rating-filters">
                    {[4.5, 4.0, 3.5, 3.0].map(rating => (
                      <button
                        key={rating}
                        className={`rating-filter ${filters.rating === rating.toString() ? 'active' : ''}`}
                        onClick={() => handleFilterChange('rating', rating.toString())}
                      >
                        <span className="material-icons">star</span>
                        {rating}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gamme de prix */}
                <div className="filter-section">
                  <h4>Gamme de prix</h4>
                  <div className="price-filters">
                    {['€', '€€', '€€€'].map(price => (
                      <button
                        key={price}
                        className={`price-filter ${filters.priceRange === price ? 'active' : ''}`}
                        onClick={() => handleFilterChange('priceRange', price)}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temps de livraison */}
                <div className="filter-section">
                  <h4>Temps de livraison</h4>
                  <div className="time-filters">
                    <button
                      className={`time-filter ${filters.deliveryTime === 'fast' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('deliveryTime', 'fast')}
                    >
                      <span className="material-icons">flash_on</span>
                      Moins de 30 min
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Liste des restaurants */}
            <main className="restaurants-main">
              <div className="results-header">
                <p>{sortedRestaurants.length} restaurant{sortedRestaurants.length > 1 ? 's' : ''} trouvé{sortedRestaurants.length > 1 ? 's' : ''}</p>
              </div>

              {sortedRestaurants.length === 0 && !loading ? (
                <div className="empty-state">
                  <div className="empty-icon">🏪</div>
                  <h3>Aucun restaurant trouvé</h3>
                  <p>Aucun restaurant ne correspond à vos critères de recherche</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Effacer les filtres
                  </button>
                </div>
              ) : (
                <div className="restaurants-grid">
                  {sortedRestaurants.map(restaurant => (
                    <Link
                      key={restaurant._id}
                      to={`/user/restaurant/${restaurant._id}`}
                      className="restaurant-card"
                    >
                      <div className="restaurant-image">
                        {restaurant.image ? (
                          <img src={restaurant.image} alt={restaurant.name} />
                        ) : (
                          <div className="image-placeholder">
                            <span className="material-icons">restaurant</span>
                          </div>
                        )}
                        {restaurant.tags && restaurant.tags.length > 0 && (
                          <div className="restaurant-tags">
                            {restaurant.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="restaurant-info">
                        <div className="restaurant-header">
                          <h3>{restaurant.name}</h3>
                          <div className="restaurant-rating">
                            <span className="material-icons">star</span>
                            {restaurant.rating || 'N/A'}
                          </div>
                        </div>

                        <p className="restaurant-description">
                          {restaurant.description || 'Aucune description disponible'}
                        </p>

                        <div className="restaurant-details">
                          <span className="cuisine">{restaurant.cuisine || 'Cuisine non spécifiée'}</span>
                          <span className="delivery-time">
                            <span className="material-icons">delivery_dining</span>
                            {restaurant.deliveryTime || 'N/A'}
                          </span>
                          <span className="price-range">{restaurant.priceRange || 'N/A'}</span>
                        </div>

                        <div className="restaurant-actions">
                          <button className="btn btn-primary">
                            Voir le menu
                          </button>
                          <button className="btn btn-outline">
                            <span className="material-icons">favorite_border</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList; 