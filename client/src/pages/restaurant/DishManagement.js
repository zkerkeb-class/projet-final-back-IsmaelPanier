import React from 'react';
import { Link } from 'react-router-dom';

const DishManagement = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Restaurant</h3>
        <ul className="sidebar-menu">
          <li><Link to="/restaurant/dashboard">Dashboard</Link></li>
          <li><Link to="/restaurant/dishes" className="active">Mes Plats</Link></li>
          <li><Link to="/restaurant/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Gestion des Plats</h1>
          <p>Ajoutez, modifiez ou supprimez vos plats</p>
        </div>

        <div className="dish-management">
          <div className="card">
            <div className="card-header">
              <h3>Mes plats</h3>
            </div>
            <div className="card-body">
              <p>Cette section permettra de gérer les plats du restaurant.</p>
              <p>Fonctionnalité à implémenter...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishManagement; 