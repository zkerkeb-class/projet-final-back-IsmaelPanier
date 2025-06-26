import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-toastify';
import './Dashboard.css';

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

// Message de confirmation au chargement du dashboard
console.log('🏪 Dashboard Restaurant - Connexion API:', API_BASE_URL);

const RestaurantDashboard = () => {
  const { user, token } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  
  // États du dashboard
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalDishes: 0,
    averageRating: 0,
    monthlyRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  // Données de démonstration
  const demoStats = {
    todayOrders: 12,
    todayRevenue: 245.80,
    pendingOrders: 3,
    totalDishes: 24,
    averageRating: 4.7,
    monthlyRevenue: 8740.50
  };

  const demoRecentOrders = [
    { 
      id: '#12847', 
      customer: 'Marie L.', 
      items: 'Pizza Margherita x2, Coca Cola x1', 
      total: '24.50€', 
      status: 'pending', 
      time: '14:32',
      estimatedDelivery: '15:02'
    },
    { 
      id: '#12846', 
      customer: 'Thomas M.', 
      items: 'Burger Classic, Frites', 
      total: '18.90€', 
      status: 'preparing', 
      time: '14:28',
      estimatedDelivery: '14:58'
    },
    { 
      id: '#12845', 
      customer: 'Sophie R.', 
      items: 'Salade César, Eau minérale', 
      total: '12.50€', 
      status: 'ready', 
      time: '14:15',
      estimatedDelivery: '14:45'
    }
  ];

  const demoTopDishes = [
    { name: 'Pizza Margherita', sales: 45, revenue: '562.50€', trend: '+12%' },
    { name: 'Burger Classic', sales: 38, revenue: '456.20€', trend: '+8%' },
    { name: 'Salade César', sales: 32, revenue: '400.00€', trend: '+15%' },
    { name: 'Pizza 4 Fromages', sales: 25, revenue: '422.50€', trend: '-3%' }
  ];

  // Récupération des données du restaurant
  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!token) {
        setRestaurantData({
          name: 'Mon Restaurant',
          cuisine: 'Française',
          rating: 4.7,
          address: { city: 'Paris' }
        });
        setStats(demoStats);
        setRecentOrders(demoRecentOrders);
        setTopDishes(demoTopDishes);
        setLoading(false);
        return;
      }
      
      console.log('🔍 Tentative de récupération des données du restaurant...');
      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Réponse API restaurant/me:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données restaurant reçues:', data);
        if (data.success && data.data) {
          setRestaurantData(data.data);
          setIsOpen(data.data.isOpen !== false);
        } else {
          console.log('⚠️ Pas de données restaurant, utilisation des données par défaut');
          setRestaurantData({
            name: user?.name || 'Mon Restaurant',
            cuisine: 'Française',
            rating: 4.7,
            address: { city: 'Paris' }
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Erreur API restaurant/me:', errorData);
        setRestaurantData({
          name: user?.name || 'Mon Restaurant',
          cuisine: 'Française',
          rating: 4.7,
          address: { city: 'Paris' }
        });
      }

      // Utiliser les données de démonstration pour l'instant
      setStats(demoStats);
      setRecentOrders(demoRecentOrders);
      setTopDishes(demoTopDishes);

    } catch (error) {
      console.error('❌ Erreur chargement restaurant:', error);
      setRestaurantData({
        name: user?.name || 'Mon Restaurant',
        cuisine: 'Française',
        rating: 4.7,
        address: { city: 'Paris' }
      });
      setStats(demoStats);
      setRecentOrders(demoRecentOrders);
      setTopDishes(demoTopDishes);
    } finally {
      setLoading(false);
    }
  }, [token, user, demoStats, demoRecentOrders, demoTopDishes]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  // Écouter les nouvelles commandes via WebSocket
  useEffect(() => {
    if (socket) {
      socket.on('new-order', (data) => {
        toast.info(`🆕 Nouvelle commande reçue ! #${data.order.id}`);
        // Mettre à jour les statistiques
        setStats(prev => ({
          ...prev,
          todayOrders: prev.todayOrders + 1,
          pendingOrders: prev.pendingOrders + 1
        }));
      });

      return () => {
        socket.off('new-order');
      };
    }
  }, [socket]);

  // Fonctions utilitaires
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'on-way': return 'status-delivering';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'on-way': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const toggleRestaurantStatus = () => {
    setIsOpen(!isOpen);
    toast.success(isOpen ? '🏪 Restaurant fermé' : '🏪 Restaurant ouvert');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard">
      {/* Section de test pour Fatou */}
      <div className="test-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2>🎉 Bienvenue Fatou !</h2>
        <p>Test de connexion au dashboard restaurant</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <strong>Utilisateur:</strong> {user?.name || 'Non défini'}
          </div>
          <div>
            <strong>Email:</strong> {user?.email || 'Non défini'}
              </div>
          <div>
            <strong>Rôle:</strong> {user?.role || 'Non défini'}
            </div>
          <div>
            <strong>Token:</strong> {token ? '✅ Présent' : '❌ Absent'}
          </div>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Restaurant: {restaurantData?.name || 'Chargement...'}
          </div>
            </div>
            
      {/* Header du Dashboard */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="restaurant-info">
            <div className="restaurant-avatar">
              🏪
            </div>
            <div className="restaurant-details">
              <h1>{restaurantData?.name || 'Mon Restaurant'}</h1>
              <p>{restaurantData?.cuisine || 'Cuisine française'} • {restaurantData?.address?.city || 'Paris'}</p>
              <div className="restaurant-status">
                <span className={`status-indicator ${isOpen ? 'open' : 'closed'}`}>
                  {isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
                </span>
              <button 
                  onClick={toggleRestaurantStatus}
                  className="toggle-status-btn"
              >
                  {isOpen ? 'Fermer' : 'Ouvrir'}
                </button>
                </div>
                </div>
                </div>
          
          <div className="header-actions">
            <div className="socket-status">
              <span className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </div>
            <Link to="/restaurant/profile" className="btn btn-outline">
              ⚙️ Paramètres
            </Link>
                </div>
              </div>
      </header>

      {/* Statistiques principales */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.todayOrders}</h3>
              <p>Commandes aujourd'hui</p>
              <span className="stat-trend positive">+15% vs hier</span>
                </div>
              </div>

          <div className="stat-card success">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{stats.todayRevenue.toFixed(2)}€</h3>
              <p>Revenus aujourd'hui</p>
              <span className="stat-trend positive">+8% vs hier</span>
                </div>
              </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pendingOrders}</h3>
              <p>Commandes en attente</p>
              <span className="stat-trend neutral">En temps réel</span>
                </div>
              </div>
          
          <div className="stat-card info">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{stats.averageRating}</h3>
              <p>Note moyenne</p>
              <span className="stat-trend positive">+0.2 vs hier</span>
            </div>
                </div>
              </div>
            </section>

      {/* Contenu principal */}
      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Commandes récentes */}
          <section className="dashboard-card orders-section">
              <div className="card-header">
              <h2>📋 Commandes récentes</h2>
              <Link to="/restaurant/orders" className="btn btn-primary btn-sm">
                Voir toutes
                </Link>
              </div>
            
              <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="order-item">
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                      </div>
                      <div className="order-details">
                    <p className="customer-name">{order.customer}</p>
                    <p className="order-items">{order.items}</p>
                    <div className="order-meta">
                      <span className="order-time">{order.time}</span>
                      <span className="order-total">{order.total}</span>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          {/* Plats populaires */}
          <section className="dashboard-card dishes-section">
            <div className="card-header">
              <h2>🍽️ Plats populaires</h2>
              <Link to="/restaurant/dishes" className="btn btn-primary btn-sm">
                Gérer les plats
              </Link>
            </div>
            
            <div className="dishes-list">
              {topDishes.map((dish, index) => (
                <div key={index} className="dish-item">
                  <div className="dish-rank">#{index + 1}</div>
                  <div className="dish-info">
                    <h4>{dish.name}</h4>
                    <p>{dish.sales} ventes • {dish.revenue}</p>
                  </div>
                  <div className="dish-trend">
                    <span className={`trend ${dish.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {dish.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions rapides */}
          <section className="dashboard-card quick-actions">
            <div className="card-header">
              <h2>⚡ Actions rapides</h2>
                </div>
            
            <div className="actions-grid">
              <Link to="/restaurant/dishes" className="action-card">
                <div className="action-icon">🍽️</div>
                <h3>Gérer les plats</h3>
                <p>Ajouter, modifier ou supprimer des plats</p>
              </Link>

              <Link to="/restaurant/orders" className="action-card">
                <div className="action-icon">📦</div>
                <h3>Gérer les commandes</h3>
                <p>Voir et traiter les commandes</p>
              </Link>

              <Link to="/restaurant/profile" className="action-card">
                <div className="action-icon">🏪</div>
                <h3>Profil restaurant</h3>
                <p>Modifier les informations du restaurant</p>
              </Link>

              <div className="action-card" onClick={toggleRestaurantStatus}>
                <div className="action-icon">{isOpen ? '🔴' : '🟢'}</div>
                <h3>{isOpen ? 'Fermer' : 'Ouvrir'} le restaurant</h3>
                <p>Changer le statut d'ouverture</p>
              </div>
            </div>
          </section>

          {/* Statistiques mensuelles */}
          <section className="dashboard-card monthly-stats">
            <div className="card-header">
              <h2>📊 Statistiques mensuelles</h2>
            </div>
            
            <div className="monthly-data">
              <div className="monthly-stat">
                <h3>{stats.monthlyRevenue.toFixed(2)}€</h3>
                <p>Revenus du mois</p>
                </div>
              <div className="monthly-stat">
                <h3>{stats.totalDishes}</h3>
                <p>Plats disponibles</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard; 