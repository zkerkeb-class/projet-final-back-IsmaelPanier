import React from 'react';
import './WelcomeModal.css';

const WelcomeModal = ({ isOpen, onClose, restaurantName, onGoToDashboard }) => {
  if (!isOpen) return null;

  return (
    <div className="welcome-modal-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-content">
          <div className="welcome-icon">
            🎉
          </div>
          
          <h1>Bienvenue !</h1>
          
          <p className="welcome-message">
            Félicitations ! Votre restaurant <strong>{restaurantName}</strong> a été créé avec succès.
          </p>
          
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">🏪</span>
              <span>Profil restaurant configuré</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🍽️</span>
              <span>Menu et plats ajoutés</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Prêt à recevoir des commandes</span>
            </div>
          </div>
          
          <div className="welcome-actions">
            <button 
              className="btn btn-primary"
              onClick={onGoToDashboard}
            >
              Accéder au tableau de bord
            </button>
            
            <button 
              className="btn btn-outline"
              onClick={onClose}
            >
              Continuer l'exploration
            </button>
          </div>
          
          <div className="welcome-tips">
            <h3>Prochaines étapes :</h3>
            <ul>
              <li>Personnalisez votre profil restaurant</li>
              <li>Ajoutez plus de plats à votre menu</li>
              <li>Configurez vos horaires d'ouverture</li>
              <li>Commencez à recevoir des commandes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal; 