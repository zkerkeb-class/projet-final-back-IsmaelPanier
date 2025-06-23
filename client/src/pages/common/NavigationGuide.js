import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavigationGuide.css';

const NavigationGuide = () => {
  const { isAuthenticated, isRestaurant, isUser } = useAuth();

  return (
    <div className="navigation-guide-page">
      <div className="container">
        <div className="guide-header">
          <h1>🧭 Guide de Navigation - FoodDelivery+</h1>
          <p>Découvrez toutes les interfaces et fonctionnalités disponibles</p>
        </div>

        {/* Section Authentification */}
        <section className="guide-section">
          <h2>🔐 Authentification</h2>
          <div className="interface-grid">
            <div className="interface-card">
              <div className="interface-icon">👤</div>
              <h3>Inscription (Client/Restaurant)</h3>
              <p>Page d'inscription unifiée avec sélection du type de compte</p>
              <Link to="/register" className="btn btn-primary">Tester</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">🏪</div>
              <h3>Inscription Restaurant Avancée</h3>
              <p>Formulaire multi-étapes avec upload d'images pour restaurants</p>
              <Link to="/restaurant-register" className="btn btn-primary">Tester</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">🔑</div>
              <h3>Connexion</h3>
              <p>Connectez-vous à votre compte</p>
              <Link to="/login" className="btn btn-primary">Tester</Link>
            </div>
          </div>
        </section>

        {/* Section Client */}
        <section className="guide-section">
          <h2>👥 Interface Client</h2>
          <div className="interface-grid">
            <div className="interface-card">
              <div className="interface-icon">🏠</div>
              <h3>Dashboard Client</h3>
              <p>Vue d'ensemble de votre compte client</p>
              <Link to="/user/dashboard" className="btn btn-secondary">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">🍽️</div>
              <h3>Liste des Restaurants</h3>
              <p>Parcourez tous les restaurants disponibles</p>
              <Link to="/user/restaurants" className="btn btn-secondary">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">📋</div>
              <h3>Menu Restaurant</h3>
              <p>Consultez le menu d'un restaurant spécifique</p>
              <Link to="/user/restaurants" className="btn btn-secondary">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">🚚</div>
              <h3>Suivi de Commande</h3>
              <p>Suivez vos commandes en temps réel</p>
              <Link to="/user/orders" className="btn btn-secondary">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">📚</div>
              <h3>Historique des Commandes</h3>
              <p>Consultez toutes vos commandes passées</p>
              <Link to="/user/orders" className="btn btn-secondary">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">❤️</div>
              <h3>Favoris</h3>
              <p>Gérez vos restaurants et plats favoris</p>
              <Link to="/user/favorites" className="btn btn-secondary">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">👤</div>
              <h3>Profil Client</h3>
              <p>Gérez vos informations personnelles</p>
              <Link to="/user/profile" className="btn btn-secondary">Voir</Link>
            </div>
          </div>
        </section>

        {/* Section Restaurant */}
        <section className="guide-section">
          <h2>🏪 Interface Restaurant</h2>
          <div className="interface-grid">
            <div className="interface-card">
              <div className="interface-icon">📊</div>
              <h3>Dashboard Restaurant</h3>
              <p>Vue d'ensemble de votre restaurant</p>
              <Link to="/restaurant/dashboard" className="btn btn-success">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">🍽️</div>
              <h3>Gestion des Plats</h3>
              <p>Ajoutez, modifiez et supprimez vos plats</p>
              <Link to="/restaurant/dishes" className="btn btn-success">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">⚙️</div>
              <h3>Gestion Avancée des Plats</h3>
              <p>Interface avancée pour la gestion complète</p>
              <Link to="/restaurant/dishes/advanced" className="btn btn-success">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">📦</div>
              <h3>Gestion des Commandes</h3>
              <p>Acceptez et gérez les commandes clients</p>
              <Link to="/restaurant/orders" className="btn btn-success">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">🏪</div>
              <h3>Profil Restaurant</h3>
              <p>Gérez les informations de votre restaurant</p>
              <Link to="/restaurant/profile" className="btn btn-success">Voir</Link>
            </div>
          </div>
        </section>

        {/* Section Pages Communes */}
        <section className="guide-section">
          <h2>🌐 Pages Communes</h2>
          <div className="interface-grid">
            <div className="interface-card">
              <div className="interface-icon">🏠</div>
              <h3>Page d'Accueil</h3>
              <p>Page principale de l'application</p>
              <Link to="/" className="btn btn-info">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">ℹ️</div>
              <h3>À Propos</h3>
              <p>Informations sur FoodDelivery+</p>
              <Link to="/about" className="btn btn-info">Voir</Link>
            </div>
            <div className="interface-card">
              <div className="interface-icon">📞</div>
              <h3>Contact</h3>
              <p>Contactez notre équipe</p>
              <Link to="/contact" className="btn btn-info">Voir</Link>
            </div>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section className="guide-section">
          <h2>✨ Fonctionnalités Spéciales</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🌓</span>
              <div className="feature-content">
                <h4>Thème Clair/Sombre</h4>
                <p>Basculez entre les thèmes clair et sombre</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div className="feature-content">
                <h4>Design Responsive</h4>
                <p>Interface adaptée à tous les appareils</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <div className="feature-content">
                <h4>Notifications</h4>
                <p>Système de notifications en temps réel</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🖼️</span>
              <div className="feature-content">
                <h4>Upload d'Images</h4>
                <p>Ajoutez des images à vos plats</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">❤️</span>
              <div className="feature-content">
                <h4>Système de Favoris</h4>
                <p>Marquez vos restaurants et plats préférés</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <div className="feature-content">
                <h4>Suivi de Livraison</h4>
                <p>Suivez vos commandes en temps réel</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Statut */}
        <section className="guide-section">
          <h2>📊 Statut Actuel</h2>
          <div className="status-grid">
            <div className="status-card">
              <h3>Authentification</h3>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Inscription Client</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Inscription Restaurant</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Connexion</span>
              </div>
            </div>
            <div className="status-card">
              <h3>Interface Client</h3>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Dashboard</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Liste Restaurants</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Menu & Commandes</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Favoris</span>
              </div>
            </div>
            <div className="status-card">
              <h3>Interface Restaurant</h3>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Dashboard</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Gestion Plats</span>
              </div>
              <div className="status-item">
                <span className="status-dot success"></span>
                <span>Gestion Commandes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section className="guide-section">
          <h2>⚡ Actions Rapides</h2>
          <div className="quick-actions">
            <Link to="/" className="btn btn-primary btn-large">
              🏠 Retour à l'Accueil
            </Link>
            <Link to="/register" className="btn btn-secondary btn-large">
              👤 Créer un Compte
            </Link>
            <Link to="/restaurant-register" className="btn btn-success btn-large">
              🏪 Inscription Restaurant
            </Link>
            <Link to="/user/restaurants" className="btn btn-info btn-large">
              🍽️ Voir les Restaurants
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NavigationGuide; 