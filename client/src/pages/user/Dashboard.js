import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

const UserDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // Récupérer tous les restaurants
  useEffect(() => {
    fetchRestaurants();
    loadFavorites();
  }, []);

  const fetchRestaurants = async () => {
    try {
      console.log('🏪 Récupération des restaurants...');
      const response = await fetch(`${API_BASE_URL}/restaurant`);
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
        console.log('✅ Restaurants récupérés:', data.length);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (restaurant) => {
    const newFavorites = favorites.includes(restaurant._id)
      ? favorites.filter(id => id !== restaurant._id)
      : [...favorites, restaurant._id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    console.log('❤️ Favoris mis à jour');
  };

  const fetchDishes = async (restaurantId) => {
    try {
      console.log('🍽️ Récupération des plats pour le restaurant:', restaurantId);
      const response = await fetch(`${API_BASE_URL}/dishes?restaurantId=${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setDishes(data);
        console.log('✅ Plats récupérés:', data.length);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des plats:', error);
    }
  };

  const addToCart = (dish) => {
    const existingItem = cart.find(item => item._id === dish._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === dish._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
    console.log('🛒 Plat ajouté au panier:', dish.name);
  };

  const removeFromCart = (dishId) => {
    setCart(cart.filter(item => item._id !== dishId));
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCart(cart.map(item => 
        item._id === dishId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteRestaurants = restaurants.filter(restaurant => 
    favorites.includes(restaurant._id)
  );

  if (loading) {
    return (
      <div className="dashboard">
        <div className="sidebar">
          <h3>Menu Client</h3>
          <ul className="sidebar-menu">
            <li><Link to="/user/dashboard" className="active">Accueil</Link></li>
            <li><Link to="/user/restaurants">Restaurants</Link></li>
            <li><Link to="/user/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Client</h3>
        <ul className="sidebar-menu">
          <li><Link to="/user/dashboard" className="active">Accueil</Link></li>
          <li><Link to="/user/restaurants">Restaurants</Link></li>
          <li><Link to="/user/profile">Profil</Link></li>
        </ul>

        {/* Panier */}
        <div className="cart-section">
          <h4>🛒 Mon Panier</h4>
          {cart.length === 0 ? (
            <p className="empty-cart">Votre panier est vide</p>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <h5>{item.name}</h5>
                    <p>{item.price}€</p>
                  </div>
                  <div className="cart-item-actions">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="btn-quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="btn-quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <strong>Total: {getTotalPrice().toFixed(2)}€</strong>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Commander
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Bienvenue, {user?.firstName} !</h1>
          <p>Découvrez les meilleurs restaurants et commandez vos plats préférés</p>
        </div>

        {/* Barre de recherche */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Rechercher un restaurant ou une cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Restaurants favoris */}
        {favoriteRestaurants.length > 0 && (
          <div className="favorites-section">
            <h2>❤️ Mes Restaurants Favoris</h2>
            <div className="restaurants-grid">
              {favoriteRestaurants.map(restaurant => (
                <div key={restaurant._id} className="restaurant-card">
                  <div className="restaurant-header">
                    <h3>{restaurant.name}</h3>
                    <button
                      onClick={() => toggleFavorite(restaurant)}
                      className="favorite-btn active"
                    >
                      ❤️
                    </button>
                  </div>
                  <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                  <p className="restaurant-description">{restaurant.description}</p>
                  <div className="restaurant-info">
                    <span>📍 {restaurant.address?.city}</span>
                    <span>💰 {restaurant.priceRange}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      fetchDishes(restaurant._id);
                    }}
                    className="btn btn-primary"
                  >
                    Voir les plats
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tous les restaurants */}
        <div className="restaurants-section">
          <h2>🍽️ Tous les Restaurants</h2>
          <div className="restaurants-grid">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-card">
                <div className="restaurant-header">
                  <h3>{restaurant.name}</h3>
                  <button
                    onClick={() => toggleFavorite(restaurant)}
                    className={`favorite-btn ${favorites.includes(restaurant._id) ? 'active' : ''}`}
                  >
                    {favorites.includes(restaurant._id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                <p className="restaurant-description">{restaurant.description}</p>
                <div className="restaurant-info">
                  <span>📍 {restaurant.address?.city}</span>
                  <span>💰 {restaurant.priceRange}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    fetchDishes(restaurant._id);
                  }}
                  className="btn btn-primary"
                >
                  Voir les plats
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal des plats */}
        {selectedRestaurant && (
          <div className="modal-overlay" onClick={() => setSelectedRestaurant(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🍽️ {selectedRestaurant.name}</h2>
                <button 
                  onClick={() => setSelectedRestaurant(null)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>
              <div className="dishes-grid">
                {dishes.map(dish => (
                  <div key={dish._id} className="dish-card">
                    <div className="dish-image">
                      <img src={dish.imageUrl || 'https://via.placeholder.com/200x150'} alt={dish.name} />
                    </div>
                    <div className="dish-info">
                      <h3>{dish.name}</h3>
                      <p>{dish.description}</p>
                      <div className="dish-details">
                        <span className="dish-price">{dish.price}€</span>
                        <span className="dish-category">{dish.category}</span>
                      </div>
                      <button
                        onClick={() => addToCart(dish)}
                        className="btn btn-success"
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard; 