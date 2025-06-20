import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantProfile = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Restaurant</h3>
        <ul className="sidebar-menu">
          <li><Link to="/restaurant/dashboard">Dashboard</Link></li>
          <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
          <li><Link to="/restaurant/profile" className="active">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Profil Restaurant</h1>
          <p>Gérez les informations de votre restaurant</p>
        </div>

        <div className="profile-section">
          <div className="card">
            <div className="card-header">
              <h3>Informations du restaurant</h3>
            </div>
            <div className="card-body">
              <p>Cette section permettra de modifier les informations du restaurant.</p>
              <p>Fonctionnalité à implémenter...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile; 