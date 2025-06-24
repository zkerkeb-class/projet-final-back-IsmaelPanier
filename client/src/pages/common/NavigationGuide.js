import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationGuide.css';

const NavigationGuide = () => {
  return (
    <div className="navigation-guide">
      <div className="guide-container">
        <h1>Guide de Navigation</h1>
        <p>Découvrez comment utiliser notre application de livraison de nourriture</p>
        
        <div className="guide-sections">
          <div className="guide-section">
            <h2>Pour les Clients</h2>
            <ul>
              <li><strong>Accueil :</strong> Découvrez nos restaurants partenaires</li>
              <li><strong>Restaurants :</strong> Parcourez les menus et passez commande</li>
              <li><strong>Favoris :</strong> Sauvegardez vos restaurants préférés</li>
              <li><strong>Commandes :</strong> Suivez vos commandes en temps réel</li>
              <li><strong>Profil :</strong> Gérez vos informations personnelles</li>
            </ul>
          </div>
          
          <div className="guide-section">
            <h2>Pour les Restaurants</h2>
            <ul>
              <li><strong>Tableau de bord :</strong> Gérez vos commandes et statistiques</li>
              <li><strong>Gestion des plats :</strong> Ajoutez, modifiez ou supprimez des plats</li>
              <li><strong>Commandes :</strong> Traitez les commandes entrantes</li>
              <li><strong>Profil :</strong> Mettez à jour les informations de votre restaurant</li>
            </ul>
          </div>
        </div>
        
        <div className="guide-actions">
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationGuide; 