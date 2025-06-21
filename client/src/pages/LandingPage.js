import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🍕 FoodDelivery+</h1>
          <p className="hero-subtitle">
            La meilleure plateforme de livraison de nourriture
          </p>
          <p className="hero-description">
            Commandez vos plats préférés ou gérez votre restaurant en toute simplicité
          </p>
        </div>
      </div>

      <div className="choice-section">
        <div className="container">
          <h2 className="section-title">Choisissez votre profil</h2>
          
          <div className="choice-grid">
            <div className="choice-card">
              <div className="choice-icon">👤</div>
              <h3>Client</h3>
              <p>Commandez vos plats préférés auprès des meilleurs restaurants</p>
              <div className="choice-features">
                <ul>
                  <li>✓ Parcourez les restaurants</li>
                  <li>✓ Commandez en ligne</li>
                  <li>✓ Suivez vos livraisons</li>
                  <li>✓ Profil personnalisé</li>
                </ul>
              </div>
              <div className="choice-actions">
                <Link to="/register" className="btn btn-primary">
                  Devenir Client
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Se connecter
                </Link>
              </div>
            </div>

            <div className="choice-card">
              <div className="choice-icon">🏪</div>
              <h3>Restaurant</h3>
              <p>Gérez votre restaurant et développez votre activité</p>
              <div className="choice-features">
                <ul>
                  <li>✓ Gérez vos plats</li>
                  <li>✓ Recevez des commandes</li>
                  <li>✓ Suivez vos statistiques</li>
                  <li>✓ Profil restaurant</li>
                </ul>
              </div>
              <div className="choice-actions">
                <Link to="/register" className="btn btn-primary">
                  Devenir Restaurant
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 