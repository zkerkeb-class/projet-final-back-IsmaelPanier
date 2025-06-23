import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { logout, isAuthenticated, isRestaurant, isUser, user } = useAuth();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('🚪 Déconnexion en cours...');
    logout();
    console.log('✅ Déconnexion terminée, redirection vers l\'accueil');
    navigate('/', { replace: true });
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            🍕 FoodDelivery+
          </Link>
        </div>
        
        <nav className="nav-main">
          <ul className="nav-menu">
            {/* Routes principales toujours visibles */}
            <li>
              <Link to="/" className="nav-link">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/navigation-guide" className="nav-link">
                🧭 Guide
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          {/* Bouton de changement de thème */}
          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary">
                Inscription
              </Link>
            </div>
          ) : (
            <div className="account-section" ref={accountMenuRef}>
              <button 
                className="account-button"
                onClick={toggleAccountMenu}
              >
                <span className="account-icon">👤</span>
                <span className="account-name">
                  {user?.firstName || 'Compte'}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showAccountMenu && (
                <div className="account-dropdown">
                  {isUser && (
                    <>
                      <Link to="/user/dashboard" className="dropdown-item">
                        🏠 Dashboard
                      </Link>
                      <Link to="/user/restaurants" className="dropdown-item">
                        🍽️ Restaurants
                      </Link>
                      <Link to="/user/favorites" className="dropdown-item">
                        ❤️ Favoris
                      </Link>
                      <Link to="/user/orders" className="dropdown-item">
                        📋 Mes Commandes
                      </Link>
                      <Link to="/user/profile" className="dropdown-item">
                        👤 Mon Profil
                      </Link>
                    </>
                  )}

                  {isRestaurant && (
                    <>
                      <Link to="/restaurant/dashboard" className="dropdown-item">
                        📊 Dashboard
                      </Link>
                      <Link to="/restaurant/dishes" className="dropdown-item">
                        🍽️ Mes Plats
                      </Link>
                      <Link to="/restaurant/orders" className="dropdown-item">
                        📦 Commandes
                      </Link>
                      <Link to="/restaurant/profile" className="dropdown-item">
                        🏪 Mon Restaurant
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item logout-item"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 