import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [favorites, setFavorites] = useState({
    restaurants: [],
    dishes: []
  });

  // Données de test - mémorisées pour éviter les re-renders
  const mockFavorites = useMemo(() => ({
    restaurants: [
      {
        _id: '665c1e2f8b1e8a001e3e4a1b',
        name: 'Pizza Palace',
        cuisine: 'Italienne',
        rating: 4.5,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
      },
      {
        _id: '665c1e2f8b1e8a001e3e4a1c',
        name: 'Sushi Master',
        cuisine: 'Japonaise',
        rating: 4.8,
        deliveryTime: '30-45 min',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
      }
    ],
    dishes: [
      {
        _id: '665c1e2f8b1e8a001e3e4a21',
        name: 'Pizza Margherita',
        restaurant: 'Pizza Palace',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400'
      },
      {
        _id: '665c1e2f8b1e8a001e3e4a22',
        name: 'Sushi California',
        restaurant: 'Sushi Master',
        price: 15.80,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
      }
    ]
  }), []);

  useEffect(() => {
    // Simuler le chargement des favoris
    setTimeout(() => {
      setFavorites(mockFavorites);
    }, 500);
  }, [mockFavorites]);

  const removeFavorite = (type, id) => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item._id !== id)
    }));
  };

  const getTotalFavorites = () => {
    return favorites.restaurants.length + favorites.dishes.length;
  };

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>❤️ Mes Favoris</h1>
          <p>Vos restaurants et plats préférés</p>
          <div className="favorites-count">
            Total : {getTotalFavorites()} favoris
          </div>
        </div>

        {/* Onglets */}
        <div className="favorites-tabs">
          <button
            className={`tab-button ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurants')}
          >
            🏪 Restaurants ({favorites.restaurants.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'dishes' ? 'active' : ''}`}
            onClick={() => setActiveTab('dishes')}
          >
            🍽️ Plats ({favorites.dishes.length})
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="favorites-content">
          {activeTab === 'restaurants' && (
            <div className="favorites-section">
              {favorites.restaurants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏪</div>
                  <h3>Aucun restaurant favori</h3>
                  <p>Vous n'avez pas encore ajouté de restaurants à vos favoris</p>
                  <Link to="/user/restaurants" className="btn btn-primary">
                    Découvrir des restaurants
                  </Link>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.restaurants.map(restaurant => (
                    <div key={restaurant._id} className="favorite-card restaurant">
                      <div className="favorite-image">
                        <img src={restaurant.image} alt={restaurant.name} />
                        <button
                          className="remove-favorite"
                          onClick={() => removeFavorite('restaurants', restaurant._id)}
                        >
                          ❌
                        </button>
                      </div>
                      
                      <div className="favorite-info">
                        <h3>{restaurant.name}</h3>
                        <p className="cuisine">{restaurant.cuisine}</p>
                        
                        <div className="favorite-details">
                          <span className="rating">⭐ {restaurant.rating}</span>
                          <span className="delivery-time">🚚 {restaurant.deliveryTime}</span>
                        </div>

                        <Link 
                          to={`/user/restaurant/${restaurant._id}`}
                          className="btn btn-primary"
                        >
                          Voir le menu
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dishes' && (
            <div className="favorites-section">
              {favorites.dishes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍽️</div>
                  <h3>Aucun plat favori</h3>
                  <p>Vous n'avez pas encore ajouté de plats à vos favoris</p>
                  <Link to="/user/restaurants" className="btn btn-primary">
                    Découvrir des plats
                  </Link>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.dishes.map(dish => (
                    <div key={dish._id} className="favorite-card dish">
                      <div className="favorite-image">
                        <img src={dish.image} alt={dish.name} />
                        <button
                          className="remove-favorite"
                          onClick={() => removeFavorite('dishes', dish._id)}
                        >
                          ❌
                        </button>
                      </div>
                      
                      <div className="favorite-info">
                        <h3>{dish.name}</h3>
                        <p className="restaurant-name">{dish.restaurant}</p>
                        
                        <div className="favorite-details">
                          <span className="price">{dish.price}€</span>
                        </div>

                        <button className="btn btn-primary">
                          Commander
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="quick-actions">
          <Link to="/user/restaurants" className="btn btn-secondary">
            🍽️ Voir tous les restaurants
          </Link>
          <Link to="/user/dashboard" className="btn btn-secondary">
            🏠 Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Favorites; 