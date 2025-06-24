import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

// Message de confirmation au chargement du dashboard
console.log('🏪 Dashboard Restaurant - Connexion API:', API_BASE_URL);

const RestaurantDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    revenue: 3874,
    orders: 226,
    customers: 89,
    rating: 4.7
  });

  // Données d'exemple pour les graphiques
  const salesData = [
    { name: 'Lun', ventes: 420, commandes: 24 },
    { name: 'Mar', ventes: 380, commandes: 18 },
    { name: 'Mer', ventes: 520, commandes: 32 },
    { name: 'Jeu', ventes: 480, commandes: 28 },
    { name: 'Ven', ventes: 680, commandes: 41 },
    { name: 'Sam', ventes: 750, commandes: 45 },
    { name: 'Dim', ventes: 620, commandes: 38 }
  ];

  const recentOrders = [
    { id: '#12847', customer: 'Marie L.', items: 'Pizza Margherita x2', total: '24.50€', status: 'delivered', time: '14:32' },
    { id: '#12846', customer: 'Thomas M.', items: 'Burger Menu', total: '18.90€', status: 'preparing', time: '14:28' },
    { id: '#12845', customer: 'Sophie R.', items: 'Salade César', total: '12.50€', status: 'delivered', time: '14:15' },
    { id: '#12844', customer: 'Antoine B.', items: 'Sushi Mix x1', total: '32.00€', status: 'on-way', time: '14:10' },
    { id: '#12843', customer: 'Claire D.', items: 'Pizza 4 Fromages', total: '16.90€', status: 'preparing', time: '14:05' }
  ];

  const topDishes = [
    { name: 'Pizza Margherita', sales: 45, revenue: '562.50€', trend: '+12%' },
    { name: 'Burger Classic', sales: 38, revenue: '456.20€', trend: '+8%' },
    { name: 'Salade César', sales: 32, revenue: '400.00€', trend: '+15%' },
    { name: 'Sushi Mix', sales: 28, revenue: '896.00€', trend: '+5%' },
    { name: 'Pizza 4 Fromages', sales: 25, revenue: '422.50€', trend: '-3%' }
  ];

  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurantData(data.data);
        console.log('✅ Données restaurant chargées:', data.data);
      } else {
        // Données d'exemple si l'API ne répond pas
        setRestaurantData({
          name: 'Mon Restaurant',
          cuisine: 'Française',
          rating: 4.7,
          address: {
            street: '123 Rue de la Paix',
            city: 'Paris'
          }
        });
        console.log('📋 Utilisation des données d\'exemple');
      }
    } catch (error) {
      console.error('❌ Erreur chargement restaurant:', error);
      setRestaurantData({
        name: 'Mon Restaurant',
        cuisine: 'Française',
        rating: 4.7
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered': return 'status-delivered';
      case 'preparing': return 'status-preparing';
      case 'on-way': return 'status-on-way';
      default: return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'delivered': return 'Livré';
      case 'preparing': return 'En préparation';
      case 'on-way': return 'En route';
      default: return status;
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'add-dish':
        navigate('/restaurant/dishes');
        break;
      case 'view-orders':
        navigate('/restaurant/orders');
        break;
      case 'view-menu':
        navigate('/restaurant/dishes');
        break;
      case 'settings':
        navigate('/restaurant/profile');
        break;
      default:
        console.log('Action:', action);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-dashboard">
        <div className="uber-loading">
          <div className="uber-spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard">
      {/* Header */}
      <header className="uber-header">
        <div className="uber-header-content">
          <div className="app-logo">
            <div className="app-logo-icon">🏪</div>
            <span>Restaurant Dashboard</span>
          </div>
          
          <div className="header-user-info">
            <span className="welcome-text">Bonjour {user?.firstName || 'Restaurateur'} !</span>
            <div className="restaurant-info">
              <span className="restaurant-name">{restaurantData?.name || 'Mon Restaurant'}</span>
              <div className="restaurant-rating">
                ⭐ {restaurantData?.rating || 4.7}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1 className="welcome-title">Tableau de bord</h1>
              <p className="welcome-subtitle">
                Gérez votre restaurant et suivez vos performances
              </p>
            </div>
            
            <div className="period-selector">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="uber-input"
              >
                <option value="today">Aujourd'hui</option>
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="90days">3 derniers mois</option>
              </select>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h2 className="section-title">Actions rapides</h2>
            <div className="quick-actions-grid">
              <button 
                onClick={() => handleQuickAction('add-dish')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">➕</div>
                <div className="quick-action-content">
                  <h3>Ajouter un plat</h3>
                  <p>Enrichissez votre menu</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('view-orders')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">📋</div>
                <div className="quick-action-content">
                  <h3>Voir les commandes</h3>
                  <p>Gérez vos commandes</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('view-menu')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">🍽️</div>
                <div className="quick-action-content">
                  <h3>Gérer le menu</h3>
                  <p>Modifiez vos plats</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('settings')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">⚙️</div>
                <div className="quick-action-content">
                  <h3>Paramètres</h3>
                  <p>Configuration</p>
                </div>
              </button>
            </div>
          </section>

          {/* KPI Cards */}
          <section className="kpi-section">
            <h2 className="section-title">Performances</h2>
            <div className="kpi-grid">
              <div className="uber-card kpi-card">
                <div className="kpi-content">
                  <div className="kpi-info">
                    <p className="kpi-label">Chiffre d'affaires</p>
                    <p className="kpi-value">{stats.revenue.toLocaleString()}€</p>
                    <p className="kpi-trend positive">📈 +12.5% vs semaine dernière</p>
                  </div>
                  <div className="kpi-icon revenue">💰</div>
                </div>
              </div>

              <div className="uber-card kpi-card">
                <div className="kpi-content">
                  <div className="kpi-info">
                    <p className="kpi-label">Commandes</p>
                    <p className="kpi-value">{stats.orders}</p>
                    <p className="kpi-trend positive">📈 +8.3% vs semaine dernière</p>
                  </div>
                  <div className="kpi-icon orders">🛍️</div>
                </div>
              </div>

              <div className="uber-card kpi-card">
                <div className="kpi-content">
                  <div className="kpi-info">
                    <p className="kpi-label">Clients uniques</p>
                    <p className="kpi-value">{stats.customers}</p>
                    <p className="kpi-trend positive">📈 +15.2% vs semaine dernière</p>
                  </div>
                  <div className="kpi-icon customers">👥</div>
                </div>
              </div>

              <div className="uber-card kpi-card">
                <div className="kpi-content">
                  <div className="kpi-info">
                    <p className="kpi-label">Note moyenne</p>
                    <p className="kpi-value">{stats.rating}/5</p>
                    <p className="kpi-trend positive">⭐ +0.2 vs semaine dernière</p>
                  </div>
                  <div className="kpi-icon rating">⭐</div>
                </div>
              </div>
            </div>
          </section>

          {/* Charts and Recent Activity */}
          <div className="dashboard-grid">
            {/* Sales Chart */}
            <section className="uber-card chart-card">
              <div className="card-header">
                <h3>Ventes de la semaine</h3>
                <button className="uber-btn uber-btn-ghost">📊 Détails</button>
              </div>
              <div className="chart-container">
                <div className="simple-chart">
                  {salesData.map((data, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar"
                        style={{ 
                          height: `${(data.ventes / Math.max(...salesData.map(d => d.ventes))) * 100}%` 
                        }}
                      ></div>
                      <span className="bar-label">{data.name}</span>
                      <span className="bar-value">{data.ventes}€</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Orders */}
            <section className="uber-card orders-card">
              <div className="card-header">
                <h3>Commandes récentes</h3>
                <Link to="/restaurant/orders" className="uber-btn uber-btn-ghost">
                  Voir tout
                </Link>
              </div>
              <div className="orders-list">
                {recentOrders.map((order, index) => (
                  <div key={index} className="order-item">
                    <div className="order-info">
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                        <span className="order-time">{order.time}</span>
                      </div>
                      <div className="order-details">
                        <span className="customer-name">{order.customer}</span>
                        <span className="order-items">{order.items}</span>
                      </div>
                    </div>
                    <div className="order-meta">
                      <span className="order-total">{order.total}</span>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Top Dishes */}
          <section className="uber-card top-dishes-card">
            <div className="card-header">
              <h3>Plats les plus vendus</h3>
              <Link to="/restaurant/dishes" className="uber-btn uber-btn-ghost">
                Gérer le menu
              </Link>
            </div>
            <div className="top-dishes-list">
              {topDishes.map((dish, index) => (
                <div key={index} className="dish-item">
                  <div className="dish-rank">#{index + 1}</div>
                  <div className="dish-info">
                    <h4 className="dish-name">{dish.name}</h4>
                    <div className="dish-stats">
                      <span className="dish-sales">{dish.sales} vendus</span>
                      <span className="dish-revenue">{dish.revenue}</span>
                    </div>
                  </div>
                  <div className={`dish-trend ${dish.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {dish.trend}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation Links */}
          <section className="navigation-section">
            <h2 className="section-title">Gestion du restaurant</h2>
            <div className="navigation-grid">
              <Link to="/restaurant/dishes" className="nav-card">
                <div className="nav-card-icon">🍽️</div>
                <div className="nav-card-content">
                  <h3>Gestion des plats</h3>
                  <p>Ajoutez, modifiez et organisez votre menu</p>
                </div>
                <div className="nav-card-arrow">→</div>
              </Link>

              <Link to="/restaurant/orders" className="nav-card">
                <div className="nav-card-icon">📋</div>
                <div className="nav-card-content">
                  <h3>Gestion des commandes</h3>
                  <p>Suivez et gérez toutes vos commandes</p>
                </div>
                <div className="nav-card-arrow">→</div>
              </Link>

              <Link to="/restaurant/profile" className="nav-card">
                <div className="nav-card-icon">🏪</div>
                <div className="nav-card-content">
                  <h3>Profil du restaurant</h3>
                  <p>Modifiez les informations de votre restaurant</p>
                </div>
                <div className="nav-card-arrow">→</div>
              </Link>

              <div className="nav-card" onClick={() => alert('Fonctionnalité bientôt disponible')}>
                <div className="nav-card-icon">📊</div>
                <div className="nav-card-content">
                  <h3>Analyses détaillées</h3>
                  <p>Consultez vos statistiques avancées</p>
                </div>
                <div className="nav-card-arrow">→</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard; 