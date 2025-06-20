import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

// Message de confirmation au chargement du dashboard
console.log('🏪 Dashboard Restaurant - Connexion API:', API_BASE_URL);

const RestaurantDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchRestaurantData = useCallback(async () => {
    try {
      console.log('📊 Récupération des données du restaurant...');
      // Récupérer les statistiques du restaurant
      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('✅ Données du restaurant récupérées avec succès');
        // Ici vous pourriez récupérer les vraies statistiques
        setStats({
          totalDishes: 5, // À remplacer par les vraies données
          totalOrders: 12,
          totalRevenue: 450.50,
        });
      } else {
        console.log('❌ Erreur lors de la récupération des données du restaurant');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="sidebar">
          <h3>Menu</h3>
          <ul className="sidebar-menu">
            <li><Link to="/restaurant/dashboard" className="active">Dashboard</Link></li>
            <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
            <li><Link to="/restaurant/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Restaurant</h3>
        <ul className="sidebar-menu">
          <li><Link to="/restaurant/dashboard" className="active">Dashboard</Link></li>
          <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
          <li><Link to="/restaurant/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Dashboard Restaurant</h1>
          <p>Bienvenue, {user?.firstName} {user?.lastName}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalDishes}</div>
            <div className="stat-label">Plats disponibles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Commandes reçues</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalRevenue}€</div>
            <div className="stat-label">Chiffre d'affaires</div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2>Actions rapides</h2>
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header">
                <h3>Gérer mes plats</h3>
              </div>
              <div className="card-body">
                <p>Ajoutez, modifiez ou supprimez vos plats</p>
                <Link to="/restaurant/dishes" className="btn btn-primary">
                  Gérer les plats
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Profil restaurant</h3>
              </div>
              <div className="card-body">
                <p>Modifiez les informations de votre restaurant</p>
                <Link to="/restaurant/profile" className="btn btn-primary">
                  Modifier le profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard; 