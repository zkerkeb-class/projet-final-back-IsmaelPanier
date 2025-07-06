import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const API_BASE_URL = 'http://localhost:5000';

const Cart = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState({});

  const fetchRestaurantInfo = useCallback(async (restaurantId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const restaurantData = await response.json();
        setRestaurants(prev => ({
          ...prev,
          [restaurantId]: restaurantData
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du restaurant:', error);
    }
  }, [token]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
        
        // Charger les informations des restaurants
        const restaurantIds = [...new Set(savedCart.map(item => item.restaurantId))];
        restaurantIds.forEach(restaurantId => {
          if (restaurantId && !restaurants[restaurantId]) {
            fetchRestaurantInfo(restaurantId);
          }
        });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [fetchRestaurantInfo, restaurants]);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      const updatedCart = cart.filter((_, i) => i !== index);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      const updatedCart = [...cart];
      updatedCart[index].quantity = newQuantity;
      updatedCart[index].totalPrice = updatedCart[index].price * newQuantity;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalByRestaurant = (restaurantId) => {
    return cart
      .filter(item => item.restaurantId === restaurantId)
      .reduce((total, item) => total + item.totalPrice, 0);
  };

  const getItemsByRestaurant = (restaurantId) => {
    return cart.filter(item => item.restaurantId === restaurantId);
  };

  const placeOrder = async (restaurantId) => {
    const restaurantItems = getItemsByRestaurant(restaurantId);
    const total = getTotalByRestaurant(restaurantId);

    try {
      const orderData = {
        restaurantId,
        items: restaurantItems.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || [],
          price: item.price
        })),
        totalAmount: total,
        deliveryAddress: user.address || 'Adresse à préciser',
        specialInstructions: ''
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        
        // Supprimer les articles commandés du panier
        const updatedCart = cart.filter(item => item.restaurantId !== restaurantId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        
        navigate(`/user/orders/${order._id}`);
        alert('Commande passée avec succès ! Vous recevrez une confirmation bientôt.');
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la commande: ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  const continueShopping = () => {
    navigate('/user/restaurants');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des plats délicieux à votre panier pour commencer vos achats</p>
          <button onClick={continueShopping} className="btn btn-primary">
            Découvrir les restaurants
          </button>
        </div>
      </div>
    );
  }

  // Grouper les articles par restaurant
  const restaurantsInCart = [...new Set(cart.map(item => item.restaurantId))];

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Votre Panier</h1>
          <button onClick={clearCart} className="btn btn-outline">
            Vider le panier
          </button>
        </div>

        <div className="cart-content">
          {restaurantsInCart.map(restaurantId => {
            const restaurant = restaurants[restaurantId];
            const restaurantItems = getItemsByRestaurant(restaurantId);
            const restaurantTotal = getTotalByRestaurant(restaurantId);

            return (
              <div key={restaurantId} className="restaurant-cart-section">
                <div className="restaurant-header">
                  <h3>{restaurant?.name || 'Restaurant'}</h3>
                  <span className="restaurant-cuisine">{restaurant?.cuisine || 'Cuisine'}</span>
                </div>

                <div className="cart-items">
                  {restaurantItems.map((item, index) => {
                    const globalIndex = cart.findIndex(cartItem => 
                      cartItem.dishId === item.dishId && 
                      cartItem.restaurantId === restaurantId
                    );
                    
                    return (
                      <div key={`${item.dishId}-${index}`} className="cart-item">
                        <div className="item-image">
                          <img 
                            src={item.image || 'https://via.placeholder.com/80x80?text=Plat'} 
                            alt={item.name}
                          />
                        </div>
                        
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">{item.price}€</p>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <p className="item-options">
                              {item.selectedOptions.join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="item-quantity">
                          <button 
                            onClick={() => updateQuantity(globalIndex, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(globalIndex, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>

                        <div className="item-total">
                          <span>{item.totalPrice.toFixed(2)}€</span>
                        </div>

                        <button 
                          onClick={() => removeItem(globalIndex)}
                          className="remove-btn"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="restaurant-total">
                  <div className="total-info">
                    <span>Total pour ce restaurant:</span>
                    <span className="total-amount">{restaurantTotal.toFixed(2)}€</span>
                  </div>
                  <button 
                    onClick={() => placeOrder(restaurantId)}
                    className="btn btn-primary"
                  >
                    Commander chez {restaurant?.name || 'ce restaurant'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-footer">
          <button onClick={continueShopping} className="btn btn-outline">
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 