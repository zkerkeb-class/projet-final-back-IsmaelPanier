import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🍕 FoodDelivery+</h3>
          <p>Votre plateforme de livraison de nourriture préférée</p>
          <div className="social-links">
            <a href="#" className="social-link" title="Facebook">📘</a>
            <a href="#" className="social-link" title="Twitter">🐦</a>
            <a href="#" className="social-link" title="Instagram">📷</a>
            <a href="#" className="social-link" title="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul className="footer-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/user/restaurants">Restaurants</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Aide</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
            <li><Link to="/contact">Partenariat</Link></li>
            <li><Link to="/contact">Signalement</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Informations</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Conditions d'utilisation</Link></li>
            <li><Link to="/contact">Politique de confidentialité</Link></li>
            <li><Link to="/contact">Mentions légales</Link></li>
            <li><Link to="/contact">Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} FoodDelivery+. Tous droits réservés.</p>
        <p>Développé avec ❤️ par Ismael Panier</p>
      </div>
    </footer>
  );
};

export default Footer; 