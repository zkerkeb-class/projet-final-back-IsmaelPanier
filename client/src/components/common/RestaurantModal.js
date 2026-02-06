import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantModal.css';

const RestaurantModal = ({ restaurant, isOpen, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !restaurant) return null;

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleViewMenu = () => {
    navigate(`/user/restaurant/${restaurant._id}`);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="uber-modal-overlay" onClick={handleOverlayClick}>
      <div className="uber-modal">
        {/* Header avec image */}
        <div className="uber-modal-header">
          <img 
            src={restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'} 
            alt={restaurant.name}
          />
          
          {/* Status badge */}
          <div className={`restaurant-status-badge ${restaurant.isOpen !== false ? 'restaurant-status-open' : 'restaurant-status-closed'}`}>
            {restaurant.isOpen !== false ? 'Ouvert' : 'Fermé'}
          </div>
          
          {/* Boutons header */}
          <div className="modal-header-buttons">
            <button 
              onClick={toggleFavorite}
              className={`modal-favorite-btn ${isFavorite ? 'active' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? '#e53e3e' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button onClick={onClose} className="uber-modal-close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="uber-modal-content">
          {/* Nom et infos principales */}
          <div className="modal-restaurant-info">
            <h1 className="modal-restaurant-name">{restaurant.name}</h1>
            <p className="modal-restaurant-cuisine">
              {restaurant.cuisine} • {restaurant.description || 'Délicieux plats'}
            </p>
            
            {/* Rating et infos */}
            <div className="modal-restaurant-meta">
              <div className="restaurant-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {restaurant.rating || '4.5'}
              </div>
              <span className="modal-reviews">({restaurant.reviews || '500'}+)</span>
              
              <div className="modal-delivery-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <span>{restaurant.deliveryTime || '25-35 min'}</span>
              </div>
              
              <div className="modal-delivery-fee">
                <span>{restaurant.deliveryFee || '2,50'} € de livraison</span>
              </div>
            </div>
          </div>
          
          {/* Prix minimum */}
          <div className="modal-min-order">
            <p className="modal-min-order-label">COMMANDE MINIMUM</p>
            <p className="modal-min-order-value">{restaurant.minOrderAmount || '15'},00 €</p>
          </div>
          
          {/* Promotions */}
          {restaurant.promo && (
            <div className="modal-promo">
              <div className="modal-promo-content">
                <span className="modal-promo-icon">🎉</span>
                <p className="modal-promo-text">{restaurant.promo}</p>
              </div>
            </div>
          )}
          
          {/* Boutons d'action */}
          <div className="modal-actions">
            <button onClick={handleViewMenu} className="uber-btn uber-btn-primary uber-btn-lg modal-view-menu-btn">
              Voir le menu
            </button>
            
            <div className="modal-secondary-actions">
              <button className="uber-btn uber-btn-secondary">
                Infos
              </button>
              <button className="uber-btn uber-btn-secondary">
                Avis ({restaurant.reviews || '500'}+)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal; 