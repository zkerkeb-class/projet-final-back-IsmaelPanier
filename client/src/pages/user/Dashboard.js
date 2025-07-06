import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RestaurantModal from '../../components/common/RestaurantModal';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:5000';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('Toutes');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tous');
  const [sortBy, setSortBy] = useState('name');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cuisines = ['Toutes', 'Italienne', 'Japonaise', 'Américaine', 'Française', 'Indienne', 'Vietnamienne'];
  const priceRanges = ['Tous', 'Économique', 'Moyen', 'Élevé', 'Luxe'];

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
      
      const transformedRestaurants = Array.isArray(data) ? data : [];
      setRestaurants(transformedRestaurants);
      setFilteredRestaurants(transformedRestaurants);
    } catch (err) {
      console.error('❌ Erreur chargement restaurants:', err);
      setError('Erreur lors du chargement des restaurants');
      setRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const filterAndSortRestaurants = useCallback(() => {
    let filtered = [...restaurants];

    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine && selectedCuisine !== 'Toutes') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    if (selectedPriceRange && selectedPriceRange !== 'Tous') {
      filtered = filtered.filter(restaurant => restaurant.priceRange === selectedPriceRange);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'deliveryTime':
          const timeA = parseInt(a.deliveryTime?.split('-')[0]) || 0;
          const timeB = parseInt(b.deliveryTime?.split('-')[0]) || 0;
          return timeA - timeB;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, selectedCuisine, selectedPriceRange, sortBy]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    filterAndSortRestaurants();
  }, [filterAndSortRestaurants]);

  const handleRestaurantClick = (restaurant) => {
    // Rediriger vers la page de détails du restaurant
    navigate(`/user/restaurant/${restaurant._id}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };

  if (loading) {
    return (
      <div className="uber-loading">
        <div className="uber-spinner"></div>
        <p>Chargement des restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uber-loading">
        <h2>Erreur de chargement</h2>
        <p>{error}</p>
        <button onClick={fetchRestaurants} className="uber-btn uber-btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-uber">
      {/* Header */}
      <header className="uber-header">
        <div className="uber-header-content">
          <div className="app-logo">
            <div className="app-logo-icon">🍕</div>
            <span>FoodDelivery</span>
          </div>
          
          <div className="header-user-info">
            <span className="welcome-text">Bonjour {user?.firstName || 'Client'} !</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">Que voulez-vous manger ?</h1>
            <p className="hero-subtitle">Découvrez les meilleurs restaurants près de chez vous</p>
            
            {/* Search Bar */}
            <div className="uber-search hero-search">
              <svg className="uber-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un restaurant ou une cuisine..."
                className="uber-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          {/* Filters */}
          <section className="filters-section">
            <div className="filters-container">
              <div className="filter-group">
                <label className="filter-label">Cuisine</label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="uber-input filter-select"
                >
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Gamme de prix</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="uber-input filter-select"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="uber-input filter-select"
                >
                  <option value="name">Nom</option>
                  <option value="rating">Note</option>
                  <option value="deliveryTime">Temps de livraison</option>
                </select>
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''} disponible{filteredRestaurants.length > 1 ? 's' : ''}
              </h2>
            </div>

            {filteredRestaurants.length === 0 && !loading ? (
              <div className="empty-state">
                <div className="empty-icon">🏪</div>
                <h3>Aucun restaurant trouvé</h3>
                <p>Aucun restaurant ne correspond à vos critères de recherche</p>
              </div>
            ) : (
              <div className="uber-grid uber-grid-3">
                {filteredRestaurants.map(restaurant => (
                  <div
                    key={restaurant._id}
                    className="restaurant-card"
                    onClick={() => handleRestaurantClick(restaurant)}
                  >
                    <div className="restaurant-card-image">
                      {restaurant.image ? (
                        <img src={restaurant.image} alt={restaurant.name} />
                      ) : (
                        <div className="image-placeholder">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                            <path d="M7 2v20"/>
                            <path d="M21 15V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1z"/>
                            <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>
                          </svg>
                        </div>
                      )}
                      <div className={`restaurant-status-badge ${restaurant.isOpen !== false ? 'restaurant-status-open' : 'restaurant-status-closed'}`}>
                        {restaurant.isOpen !== false ? 'Ouvert' : 'Fermé'}
                      </div>
                    </div>
                    
                    <div className="restaurant-card-content">
                      <h3 className="restaurant-card-title">{restaurant.name}</h3>
                      <p className="restaurant-card-cuisine">{restaurant.cuisine}</p>
                      
                      <div className="restaurant-card-meta">
                        <div className="restaurant-rating-enhanced">
                          <div className="rating-stars">
                            <span className="star-icon">⭐</span>
                            <span className="rating-value">{restaurant.rating || '4.5'}</span>
                          </div>
                        </div>
                        
                        <div className="delivery-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                          </svg>
                          {restaurant.deliveryTime || '25-35 min'}
                        </div>
                        
                        <span className="price-range">{restaurant.priceRange || 'Moyen'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default UserDashboard; 