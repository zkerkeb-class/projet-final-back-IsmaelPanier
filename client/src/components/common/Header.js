import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { logout, isAuthenticated, isRestaurant, isUser, user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fermer les menus si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Écouter les changements du panier depuis localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        setCartCount(count);
      } catch (error) {
        console.error('Erreur lors de la lecture du panier:', error);
        setCartCount(0);
      }
    };

    updateCartCount();
    
    // Écouter les changements du localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les événements personnalisés pour les changements de panier
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowMenu(false);
  };

  const getDisplayName = () => {
    if (!user) return 'Compte';
    if (user.name) {
      const nameParts = user.name.split(' ');
      return nameParts[0] || 'Compte';
    }
    return user.email ? user.email.split('@')[0] : 'Compte';
  };

  const handleCartClick = () => {
    // Rediriger vers la page du panier ou ouvrir un modal
    if (isUser) {
      navigate('/user/cart');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="material-icons">restaurant</span>
          <span className="logo-text">FoodDelivery+</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="nav-desktop">
          <Link to="/" className="nav-link">
            <span className="material-icons">home</span>
            Accueil
          </Link>
          <Link to="/about" className="nav-link">
            <span className="material-icons">info</span>
            À propos
          </Link>
          <Link to="/contact" className="nav-link">
            <span className="material-icons">contact_mail</span>
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Thème */}
          <ThemeToggle />

          {/* Panier pour les utilisateurs */}
          {isAuthenticated && isUser && (
            <button 
              className="cart-button"
              onClick={handleCartClick}
              title="Voir le panier"
            >
              <span className="material-icons">shopping_cart</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
          )}

          {/* Menu utilisateur connecté */}
          {isAuthenticated ? (
            <div className="user-menu" ref={userMenuRef}>
              <button className="user-button" onClick={toggleUserMenu}>
                <span className="material-icons">account_circle</span>
                <span className="user-name">{getDisplayName()}</span>
                <span className="material-icons arrow">
                  {showUserMenu ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  {isUser && (
                    <>
                      <Link to="/user/dashboard" className="dropdown-item">
                        <span className="material-icons">dashboard</span>
                        Dashboard
                      </Link>
                      <Link to="/user/restaurants" className="dropdown-item">
                        <span className="material-icons">restaurant</span>
                        Restaurants
                      </Link>
                      <Link to="/user/orders" className="dropdown-item">
                        <span className="material-icons">receipt_long</span>
                        Mes Commandes
                      </Link>
                      <Link to="/user/favorites" className="dropdown-item">
                        <span className="material-icons">favorite</span>
                        Favoris
                      </Link>
                      <Link to="/user/profile" className="dropdown-item">
                        <span className="material-icons">person</span>
                        Profil
                      </Link>
                    </>
                  )}

                  {isRestaurant && (
                    <>
                      <Link to="/restaurant/dashboard" className="dropdown-item">
                        <span className="material-icons">analytics</span>
                        Dashboard
                      </Link>
                      <Link to="/restaurant/dishes" className="dropdown-item">
                        <span className="material-icons">restaurant_menu</span>
                        Mes Plats
                      </Link>
                      <Link to="/restaurant/orders" className="dropdown-item">
                        <span className="material-icons">inventory</span>
                        Commandes
                      </Link>
                      <Link to="/restaurant/profile" className="dropdown-item">
                        <span className="material-icons">store</span>
                        Mon Restaurant
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <span className="material-icons">logout</span>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Boutons de connexion/inscription */
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                <span className="material-icons">login</span>
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary">
                <span className="material-icons">person_add</span>
                Inscription
              </Link>
            </div>
          )}

          {/* Menu mobile */}
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="material-icons">
              {showMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {showMenu && (
        <div className="mobile-menu" ref={menuRef}>
          <nav className="nav-mobile">
            <Link to="/" className="mobile-link" onClick={() => setShowMenu(false)}>
              <span className="material-icons">home</span>
              Accueil
            </Link>
            <Link to="/about" className="mobile-link" onClick={() => setShowMenu(false)}>
              <span className="material-icons">info</span>
              À propos
            </Link>
            <Link to="/contact" className="mobile-link" onClick={() => setShowMenu(false)}>
              <span className="material-icons">contact_mail</span>
              Contact
            </Link>
            
            {!isAuthenticated && (
              <>
                <div className="mobile-divider"></div>
                <Link to="/login" className="mobile-link" onClick={() => setShowMenu(false)}>
                  <span className="material-icons">login</span>
                  Connexion
                </Link>
                <Link to="/register" className="mobile-link" onClick={() => setShowMenu(false)}>
                  <span className="material-icons">person_add</span>
                  Inscription
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 