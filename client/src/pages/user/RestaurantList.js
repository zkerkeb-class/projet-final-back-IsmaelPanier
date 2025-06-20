import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Client</h3>
        <ul className="sidebar-menu">
          <li><Link to="/user/dashboard">Accueil</Link></li>
          <li><Link to="/user/restaurants" className="active">Restaurants</Link></li>
          <li><Link to="/user/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Restaurants</h1>
          <p>Découvrez nos restaurants partenaires</p>
        </div>

        <div className="restaurant-list">
          <div className="card">
            <div className="card-header">
              <h3>Liste des restaurants</h3>
            </div>
            <div className="card-body">
              <p>Cette section affichera la liste des restaurants disponibles.</p>
              <p>Fonctionnalité à implémenter...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList; 