import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🍕 FoodDelivery
            <span className="hero-subtitle">La livraison de nourriture simplifiée</span>
          </h1>
          <p className="hero-description">
            Découvrez les meilleurs restaurants de votre région et faites-vous livrer 
            vos plats préférés en quelques clics.
          </p>
          <div className="hero-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Commencer maintenant
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Se connecter
                </Link>
              </>
            ) : (
              <Link to="/user/restaurants" className="btn btn-primary btn-large">
                Voir les restaurants
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="food-illustration">
            🍔 🍕 🍜 🥗
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Pourquoi choisir FoodDelivery ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Livraison rapide</h3>
              <p>Livraison en moins de 30 minutes dans votre zone</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Restaurants variés</h3>
              <p>Des centaines de restaurants partenaires</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Paiement sécurisé</h3>
              <p>Paiement en ligne sécurisé et simple</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Suivi en temps réel</h3>
              <p>Suivez votre commande en temps réel</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">Comment ça marche ?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Choisissez un restaurant</h3>
              <p>Parcourez notre sélection de restaurants partenaires</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Sélectionnez vos plats</h3>
              <p>Choisissez parmi une large gamme de plats délicieux</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Passez votre commande</h3>
              <p>Validez votre commande et payez en ligne</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Recevez votre repas</h3>
              <p>Votre commande vous est livrée rapidement</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à commander ?</h2>
            <p>Rejoignez des milliers de clients satisfaits</p>
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-primary btn-large">
                Créer un compte gratuit
              </Link>
            ) : (
              <Link to="/user/restaurants" className="btn btn-primary btn-large">
                Commander maintenant
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 