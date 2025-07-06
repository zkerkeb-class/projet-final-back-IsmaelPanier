import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
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
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);

  // Données pour les graphiques
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);

  // Commenting out unused COLORS variable to fix ESLint warning
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#8A2BE2'];

  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📡 Appel API pour charger les données du restaurant...');
      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📋 Statut de la réponse API pour restaurant:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Données brutes du restaurant:', data);
        setRestaurantData(data.data);
        console.log('✅ Données restaurant chargées:', data.data);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur API lors du chargement du restaurant:', response.status, errorText);
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
      console.error('❌ Erreur réseau ou autre lors du chargement du restaurant:', error);
      setRestaurantData({
        name: 'Mon Restaurant',
        cuisine: 'Française',
        rating: 4.7
      });
      console.log('📋 Utilisation des données d\'exemple (erreur réseau)');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/restaurant`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        // Données d'exemple pour les commandes
        const mockOrders = [
          { _id: '1', total: 24.50, status: 'delivered', createdAt: '2024-01-15T10:30:00Z', items: [{ dish: { category: 'Pizzas' } }] },
          { _id: '2', total: 18.90, status: 'preparing', createdAt: '2024-01-15T11:15:00Z', items: [{ dish: { category: 'Burgers' } }] },
          { _id: '3', total: 32.00, status: 'delivered', createdAt: '2024-01-15T12:00:00Z', items: [{ dish: { category: 'Sushis' } }] },
          { _id: '4', total: 16.90, status: 'delivered', createdAt: '2024-01-15T13:45:00Z', items: [{ dish: { category: 'Pizzas' } }] },
          { _id: '5', total: 28.50, status: 'preparing', createdAt: '2024-01-15T14:20:00Z', items: [{ dish: { category: 'Salades' } }] }
        ];
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
    }
  }, [token]);

  const fetchDishes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/my-dishes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDishes(Array.isArray(data) ? data : []);
      } else {
        const mockDishes = [
          { _id: '1', name: 'Pizza Margherita', category: 'Pizzas', basePrice: 12.50 },
          { _id: '2', name: 'Burger Classique', category: 'Burgers', basePrice: 14.90 },
          { _id: '3', name: 'Salade César', category: 'Salades', basePrice: 10.50 },
          { _id: '4', name: 'Sushi Mix', category: 'Sushis', basePrice: 18.00 }
        ];
        setDishes(mockDishes);
      }
    } catch (error) {
      console.error('❌ Erreur chargement plats:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurantData();
    fetchOrders();
    fetchDishes();
  }, [fetchRestaurantData, fetchOrders, fetchDishes]);

  // Génération des données pour les graphiques
  useEffect(() => {
    // Données de ventes par jour
    const salesByDay = [
      { name: 'Lun', ventes: 420, commandes: 24 },
      { name: 'Mar', ventes: 380, commandes: 18 },
      { name: 'Mer', ventes: 520, commandes: 32 },
      { name: 'Jeu', ventes: 480, commandes: 28 },
      { name: 'Ven', ventes: 680, commandes: 41 },
      { name: 'Sam', ventes: 750, commandes: 45 },
      { name: 'Dim', ventes: 620, commandes: 38 }
    ];
    setSalesData(salesByDay);

    // Données par catégorie
    const categoryStats = [
      { name: 'Pizzas', value: 35, color: '#0088FE' },
      { name: 'Burgers', value: 25, color: '#00C49F' },
      { name: 'Salades', value: 20, color: '#FFBB28' },
      { name: 'Sushis', value: 15, color: '#FF8042' },
      { name: 'Desserts', value: 5, color: '#8884D8' }
    ];
    setCategoryData(categoryStats);

    // Données par heure
    const hourlyStats = [
      { heure: '10h', commandes: 8, ventes: 120 },
      { heure: '11h', commandes: 12, ventes: 180 },
      { heure: '12h', commandes: 25, ventes: 375 },
      { heure: '13h', commandes: 18, ventes: 270 },
      { heure: '14h', commandes: 15, ventes: 225 },
      { heure: '15h', commandes: 10, ventes: 150 },
      { heure: '16h', commandes: 8, ventes: 120 },
      { heure: '17h', commandes: 12, ventes: 180 },
      { heure: '18h', commandes: 20, ventes: 300 },
      { heure: '19h', commandes: 22, ventes: 330 },
      { heure: '20h', commandes: 18, ventes: 270 },
      { heure: '21h', commandes: 12, ventes: 180 }
    ];
    setHourlyData(hourlyStats);

    // Top plats
    const topDishesData = [
      { name: 'Pizza Margherita', ventes: 45, revenue: 562.50, trend: '+12%' },
      { name: 'Burger Classic', ventes: 38, revenue: 456.20, trend: '+8%' },
      { name: 'Salade César', ventes: 32, revenue: 400.00, trend: '+15%' },
      { name: 'Sushi Mix', ventes: 28, revenue: 896.00, trend: '+5%' },
      { name: 'Pizza 4 Fromages', ventes: 25, revenue: 422.50, trend: '-3%' }
    ];
    setTopDishes(topDishesData);
  }, []);

  // Calcul des statistiques
  const stats = {
    revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2),
    orders: orders.length,
    customers: new Set(orders.map(order => order.userId)).size,
    rating: restaurantData?.rating || 4.7,
    avgOrder: orders.length > 0 ? (orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length).toFixed(2) : 0
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
                  <p>Créer un nouveau plat</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('view-orders')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">📋</div>
                <div className="quick-action-content">
                  <h3>Gérer les commandes</h3>
                  <p>Voir et traiter les commandes</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('view-menu')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">🍽️</div>
                <div className="quick-action-content">
                  <h3>Gérer le menu</h3>
                  <p>Modifier vos plats</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('settings')}
                className="quick-action-card"
              >
                <div className="quick-action-icon">⚙️</div>
                <div className="quick-action-content">
                  <h3>Paramètres</h3>
                  <p>Configurer votre restaurant</p>
                </div>
              </button>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="stats-section">
            <h2 className="section-title">Aperçu des performances</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Chiffre d'affaires</h3>
                  <p className="stat-value">{stats.revenue}€</p>
                  <span className="stat-trend positive">+12.5%</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Commandes</h3>
                  <p className="stat-value">{stats.orders}</p>
                  <span className="stat-trend positive">+8.3%</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Clients</h3>
                  <p className="stat-value">{stats.customers}</p>
                  <span className="stat-trend positive">+15.2%</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>Note moyenne</h3>
                  <p className="stat-value">{stats.rating}</p>
                  <span className="stat-trend positive">+0.2</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Panier moyen</h3>
                  <p className="stat-value">{stats.avgOrder}€</p>
                  <span className="stat-trend positive">+5.1%</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🍽️</div>
                <div className="stat-content">
                  <h3>Plats actifs</h3>
                  <p className="stat-value">{dishes.length}</p>
                  <span className="stat-trend neutral">0</span>
                </div>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-section">
            <h2 className="section-title">Analyses détaillées</h2>
            
            {/* Sales Chart */}
            <div className="chart-container">
              <h3 className="chart-title">Évolution des ventes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'ventes' ? `${value}€` : value,
                      name === 'ventes' ? 'Ventes' : 'Commandes'
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="ventes" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="charts-row">
              <div className="chart-container half">
                <h3 className="chart-title">Répartition par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Part de marché']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Hourly Activity */}
              <div className="chart-container half">
                <h3 className="chart-title">Activité par heure</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="heure" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'ventes' ? `${value}€` : value,
                        name === 'ventes' ? 'Ventes' : 'Commandes'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="commandes" fill="#8884d8" />
                    <Bar dataKey="ventes" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Dishes */}
            <div className="chart-container">
              <h3 className="chart-title">Plats les plus populaires</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topDishes} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `${value}€` : value,
                      name === 'revenue' ? 'Revenus' : 'Ventes'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="ventes" fill="#8884d8" />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Recent Orders */}
          <section className="recent-orders-section">
            <h2 className="section-title">Commandes récentes</h2>
            <div className="orders-grid">
              {orders.slice(0, 5).map((order, index) => (
                <div key={order._id || index} className="order-card">
                  <div className="order-header">
                    <span className="order-id">#{order._id || `ORD${index + 1}`}</span>
                    <span className={`order-status status-${order.status || 'pending'}`}>
                      {order.status === 'delivered' ? 'Livré' : 
                       order.status === 'preparing' ? 'En préparation' : 
                       order.status === 'pending' ? 'En attente' : order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p className="order-total">{order.total || '0'}€</p>
                    <p className="order-time">
                      {new Date(order.createdAt || Date.now()).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all-link">
              <Link to="/restaurant/orders" className="btn btn-primary">
                Voir toutes les commandes
              </Link>
            </div>
          </section>

          {/* Restaurant Details Section */}
          <section className="restaurant-details-section">
            <h2 className="section-title">Détails du Restaurant</h2>
            <div className="restaurant-details-card">
              <div className="detail-item">
                <div className="detail-icon">🏠</div>
                <div className="detail-content">
                  <h3>Adresse</h3>
                  {restaurantData?.address ? (
                    <p>
                      {restaurantData.address.street || 'Adresse à définir'}, {restaurantData.address.city || 'Ville à définir'}, 
                      {restaurantData.address.postalCode || 'Code postal à définir'}, {restaurantData.address.country || 'Pays à définir'}
                    </p>
                  ) : (
                    <p className="missing-data">Adresse non configurée. <Link to="/restaurant/profile" className="config-link">Configurer maintenant</Link></p>
                  )}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">📞</div>
                <div className="detail-content">
                  <h3>Téléphone</h3>
                  <p>{restaurantData?.phone || <span className="missing-data">Téléphone non configuré. <Link to="/restaurant/profile" className="config-link">Configurer maintenant</Link></span>}</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">⏰</div>
                <div className="detail-content">
                  <h3>Horaires d'ouverture</h3>
                  {restaurantData?.openingHours && Object.keys(restaurantData.openingHours).length > 0 ? (
                    <ul className="opening-hours-list">
                      {Object.entries(restaurantData.openingHours).map(([day, hours]) => (
                        <li key={day}>
                          <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> 
                          {hours.open || 'Non défini'} - {hours.close || 'Non défini'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="missing-data">Horaires non configurés. <Link to="/restaurant/profile" className="config-link">Configurer maintenant</Link></p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard; 