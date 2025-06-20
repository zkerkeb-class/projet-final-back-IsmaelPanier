import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated, isRestaurant, isUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('🚪 Déconnexion en cours...');
    logout();
    console.log('✅ Déconnexion terminée, redirection vers l\'accueil');
    navigate('/', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🍕 FoodDelivery
        </Link>
        
        <nav>
          <ul className="nav-menu">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/" className="nav-link">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link">
                    Inscription
                  </Link>
                </li>
              </>
            ) : isRestaurant ? (
              <>
                <li>
                  <Link to="/restaurant/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/restaurant/dishes" className="nav-link">
                    Mes Plats
                  </Link>
                </li>
                <li>
                  <Link to="/restaurant/profile" className="nav-link">
                    Profil
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    Déconnexion
                  </button>
                </li>
              </>
            ) : isUser ? (
              <>
                <li>
                  <Link to="/user/dashboard" className="nav-link">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/user/restaurants" className="nav-link">
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link to="/user/profile" className="nav-link">
                    Profil
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    Déconnexion
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 