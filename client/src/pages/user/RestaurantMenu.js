import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RestaurantMenu.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showDishModal, setShowDishModal] = useState(false);

  // Récupérer les données du restaurant et ses plats
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        // Récupérer les infos du restaurant
        const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          setRestaurant(restaurantData);
        }

        // Récupérer les plats du restaurant
        const dishesResponse = await fetch(`${API_BASE_URL}/dishes/restaurant/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (dishesResponse.ok) {
          const dishesData = await dishesResponse.json();
          console.log('Plats récupérés:', dishesData);
          console.log('Nombre de plats récupérés:', dishesData.length);
          setDishes(dishesData);
        } else {
          console.error('Erreur HTTP lors de la récupération des plats:', dishesResponse.status, dishesResponse.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId, token]);

  // Charger le panier depuis localStorage
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      // Filtrer seulement les articles de ce restaurant
      const restaurantCart = savedCart.filter(item => item.restaurantId === restaurantId);
      setCart(restaurantCart);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      setCart([]);
    }
  }, [restaurantId]);

  // Obtenir les catégories uniques
  const categories = ['Tous', ...new Set(dishes.map(dish => dish.category))];

  // Filtrer les plats
  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'Tous' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    console.log(`Plat: ${dish.name}, Disponible: ${dish.isAvailable}, Catégorie: ${dish.category}, Correspond à la catégorie: ${matchesCategory}, Correspond à la recherche: ${matchesSearch}`);
    return matchesCategory && matchesSearch;
  });

  // Ajouter au panier
  const addToCart = (dish, quantity = 1, selectedOptions = []) => {
    const cartItem = {
      dishId: dish._id,
      restaurantId: restaurantId,
      name: dish.name,
      price: dish.basePrice,
      quantity,
      selectedOptions,
      totalPrice: dish.basePrice * quantity,
      image: dish.images?.[0] || null
    };

    // Récupérer le panier existant depuis localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Vérifier si l'article existe déjà dans le panier
    const existingItemIndex = existingCart.findIndex(item => 
      item.dishId === dish._id && 
      item.restaurantId === restaurantId &&
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex !== -1) {
      // Mettre à jour la quantité
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].totalPrice = existingCart[existingItemIndex].price * existingCart[existingItemIndex].quantity;
    } else {
      // Ajouter un nouvel article
      existingCart.push(cartItem);
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Mettre à jour l'état local
    setCart(existingCart);
    
    // Déclencher l'événement de mise à jour du panier
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Afficher une notification
    alert(`${dish.name} ajouté au panier !`);
  };

  // Modifier la quantité dans le panier
  const updateCartQuantity = (index, newQuantity) => {
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

  // Calculer le total du panier
  const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);

  // Ouvrir le modal de sélection de plat
  const openDishModal = (dish) => {
    setSelectedDish(dish);
    setShowDishModal(true);
  };

  // Passer la commande
  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        restaurantId,
        items: cart.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
          price: item.price
        })),
        totalAmount: cartTotal,
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
        
        // Vider le panier de ce restaurant
        const allCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = allCart.filter(item => item.restaurantId !== restaurantId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart([]);
        setShowCart(false);
        
        // Déclencher l'événement de mise à jour du panier
        window.dispatchEvent(new Event('cartUpdated'));
        
        navigate(`/user/orders/${order._id}`);
        alert('Commande passée avec succès ! Vous recevrez une confirmation bientôt.');
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="restaurant-menu-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-menu-page">
        <div className="error-container">
          <h2>Restaurant non trouvé</h2>
          <button onClick={() => navigate('/user/restaurants')} className="btn btn-primary">
            Retour aux restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-menu-page">
      {/* Header du restaurant */}
      <div className="restaurant-header">
        <div className="restaurant-header-content">
          <div className="restaurant-info">
            <h1>{restaurant.name}</h1>
            <p className="cuisine-type">{restaurant.cuisine}</p>
            <div className="restaurant-meta">
              <span className="rating">⭐ {restaurant.rating || 'N/A'}</span>
              <span className="delivery-time">🚚 {restaurant.deliveryTime || 30} min</span>
              <span className="min-order">Min. {restaurant.minOrderAmount || 10}€</span>
            </div>
            <p className="description">{restaurant.description}</p>
          </div>
          <div className="restaurant-image">
            <img 
              src={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurant'} 
              alt={restaurant.name}
            />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="menu-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            setLoading(true);
            const fetchRestaurantData = async () => {
              try {
                const dishesResponse = await fetch(`${API_BASE_URL}/dishes/restaurant/${restaurantId}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (dishesResponse.ok) {
                  const dishesData = await dishesResponse.json();
                  console.log('Plats mis à jour:', dishesData);
                  setDishes(dishesData);
                }
              } catch (error) {
                console.error('Erreur lors de la mise à jour des plats:', error);
              } finally {
                setLoading(false);
              }
            };
            fetchRestaurantData();
          }}
          className="btn btn-primary"
        >
          Rafraîchir
        </button>
      </div>

      {/* Menu et Panier */}
      <div className="menu-container">
        <div className="menu-content">
          {/* Liste des plats */}
          <div className="dishes-section">
            {filteredDishes.length === 0 ? (
              <div className="no-dishes">
                <h3>Aucun plat trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="dishes-grid">
                {filteredDishes.map(dish => (
                  <div key={dish._id} className="dish-card">
                    <div className="dish-image">
                      <img 
                        src={dish.images?.[0] || 'https://via.placeholder.com/200x150?text=Plat'} 
                        alt={dish.name}
                      />
                      {dish.isDailySpecial && (
                        <span className="badge special">Plat du jour</span>
                      )}
                      {dish.isPromotion && (
                        <span className="badge promotion">-{dish.discountPercentage}%</span>
                      )}
                    </div>
                    <div className="dish-info">
                      <h3>{dish.name}</h3>
                      <p className="description">{dish.description}</p>
                      <div className="dish-meta">
                        <span className="price">
                          {dish.isPromotion ? (
                            <>
                              <span className="original-price">{dish.basePrice}€</span>
                              <span className="discounted-price">
                                {(dish.basePrice * (1 - dish.discountPercentage / 100)).toFixed(2)}€
                              </span>
                            </>
                          ) : (
                            <span>{dish.basePrice}€</span>
                          )}
                        </span>
                        <span className="preparation-time">⏱️ {dish.preparationTime || 15} min</span>
                      </div>
                      <div className="dish-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => openDishModal(dish)}
                        >
                          Voir détails
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => addToCart(dish)}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panier flottant */}
        {cart.length > 0 && (
          <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
            <div className="cart-header">
              <h3>Votre commande</h3>
              <button 
                className="cart-toggle"
                onClick={() => setShowCart(!showCart)}
              >
                {showCart ? '✕' : '🛒'}
              </button>
            </div>
            
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">{item.price}€</p>
                    {item.selectedOptions.length > 0 && (
                      <p className="cart-item-options">
                        {item.selectedOptions.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateCartQuantity(index, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateCartQuantity(index, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">{cartTotal.toFixed(2)}€</span>
              </div>
              <button 
                className="btn btn-primary btn-large"
                onClick={placeOrder}
                disabled={cartTotal < (restaurant.minOrderAmount || 10)}
              >
                Commander ({cartTotal.toFixed(2)}€)
              </button>
              {cartTotal < (restaurant.minOrderAmount || 10) && (
                <p className="min-order-warning">
                  Minimum de commande: {restaurant.minOrderAmount || 10}€
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de détail du plat */}
      {showDishModal && selectedDish && (
        <div className="modal-overlay" onClick={() => setShowDishModal(false)}>
          <div className="dish-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDish.name}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDishModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="dish-modal-image">
                <img 
                  src={selectedDish.images?.[0] || 'https://via.placeholder.com/400x300?text=Plat'} 
                  alt={selectedDish.name}
                />
              </div>
              
              <div className="dish-modal-info">
                <p className="description">{selectedDish.description}</p>
                
                {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
                  <div className="ingredients-section">
                    <h4>Ingrédients:</h4>
                    <ul>
                      {selectedDish.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDish.allergens && selectedDish.allergens.length > 0 && (
                  <div className="allergens-section">
                    <h4>Allergènes:</h4>
                    <div className="allergens-tags">
                      {selectedDish.allergens.map((allergen, index) => (
                        <span key={index} className="allergen-tag">{allergen}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="dish-modal-price">
                  <span className="price">{selectedDish.basePrice}€</span>
                  <span className="preparation-time">⏱️ {selectedDish.preparationTime || 15} min</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => {
                  addToCart(selectedDish);
                  setShowDishModal(false);
                }}
              >
                Ajouter au panier - {selectedDish.basePrice}€
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu; 