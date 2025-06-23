import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

const UserDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Données de test pour les restaurants
  const mockRestaurants = [
    {
      _id: '1',
      name: 'Pizza Palace',
      cuisine: 'Italienne',
      priceRange: '€€',
      rating: 4.5,
      deliveryTime: '25-35 min',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    },
    {
      _id: '2',
      name: 'Sushi Master',
      cuisine: 'Japonaise',
      priceRange: '€€€',
      rating: 4.8,
      deliveryTime: '30-45 min',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
    },
    {
      _id: '3',
      name: 'Burger House',
      cuisine: 'Américaine',
      priceRange: '€',
      rating: 4.2,
      deliveryTime: '20-30 min',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    },
    {
      _id: '4',
      name: 'Thai Delight',
      cuisine: 'Thaïlandaise',
      priceRange: '€€',
      rating: 4.6,
      deliveryTime: '25-40 min',
      isOpen: false,
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400'
    },
    {
      _id: '5',
      name: 'Le Bistrot',
      cuisine: 'Française',
      priceRange: '€€€',
      rating: 4.7,
      deliveryTime: '35-50 min',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    }
  ];

  const cuisines = ['Toutes', 'Italienne', 'Japonaise', 'Américaine', 'Thaïlandaise', 'Française', 'Chinoise', 'Indienne', 'Mexicaine'];
  const priceRanges = ['Tous', '€', '€€', '€€€'];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterAndSortRestaurants();
  }, [restaurants, searchTerm, selectedCuisine, selectedPriceRange, sortBy]);

  const filterAndSortRestaurants = () => {
    let filtered = [...restaurants];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par cuisine
    if (selectedCuisine && selectedCuisine !== 'Toutes') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    // Filtre par gamme de prix
    if (selectedPriceRange && selectedPriceRange !== 'Tous') {
      filtered = filtered.filter(restaurant => restaurant.priceRange === selectedPriceRange);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  };

  const getPriceRangeColor = (priceRange) => {
    switch (priceRange) {
      case '€': return '#10b981';
      case '€€': return '#f59e0b';
      case '€€€': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Bonjour, {user?.firstName || 'Client'} ! 👋</h1>
          <p>Découvrez les meilleurs restaurants et commandez vos plats préférés</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Rechercher un restaurant ou une cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Cuisine :</label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="filter-select"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Prix :</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="filter-select"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Trier par :</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Nom</option>
              <option value="rating">Note</option>
              <option value="deliveryTime">Temps de livraison</option>
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="results-section">
        <div className="results-header">
          <h2>Restaurants ({filteredRestaurants.length})</h2>
          {filteredRestaurants.length === 0 && (
            <p className="no-results">Aucun restaurant trouvé avec ces critères</p>
          )}
        </div>

        <div className="restaurants-grid">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card">
              <div className="restaurant-image">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className={`status-badge ${restaurant.isOpen ? 'open' : 'closed'}`}>
                  {restaurant.isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
                </div>
              </div>
              
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="cuisine">{restaurant.cuisine}</p>
                
                <div className="restaurant-details">
                  <div className="rating">
                    ⭐ {restaurant.rating}
                  </div>
                  <div 
                    className="price-range"
                    style={{ color: getPriceRangeColor(restaurant.priceRange) }}
                  >
                    {restaurant.priceRange}
                  </div>
                  <div className="delivery-time">
                    🚚 {restaurant.deliveryTime}
                  </div>
                </div>

                <div className="restaurant-actions">
                  <Link 
                    to={`/user/restaurant/${restaurant._id}`}
                    className="btn btn-primary"
                  >
                    Voir le menu
                  </Link>
                  <button className="btn btn-outline">
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <Link to="/user/restaurants" className="btn btn-secondary">
          🍽️ Voir tous les restaurants
        </Link>
        <Link to="/user/favorites" className="btn btn-secondary">
          ❤️ Mes favoris
        </Link>
        <Link to="/user/orders" className="btn btn-secondary">
          📋 Mes commandes
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard; 