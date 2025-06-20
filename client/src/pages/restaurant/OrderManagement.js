import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrderManagement.css';

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

const OrderManagement = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('realtime');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  // États pour les statistiques
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState([]);

  // Fonction pour récupérer les commandes du restaurant
  const fetchOrders = useCallback(async () => {
    try {
      console.log('📦 Récupération des commandes...');
      const response = await fetch(`${API_BASE_URL}/orders/restaurant`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Commandes récupérées:', data);
        setOrders(data);
        setFilteredOrders(data);
        updateStats(data);
      } else {
        console.error('❌ Erreur lors de la récupération des commandes');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fonction pour mettre à jour les statistiques
  const updateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(order => 
      ['pending', 'accepted', 'preparing'].includes(order.status)
    ).length;
    const completedOrders = ordersData.filter(order => 
      ['delivered', 'completed'].includes(order.status)
    ).length;
    const totalRevenue = ordersData
      .filter(order => ['delivered', 'completed'].includes(order.status))
      .reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2)
    });
  };

  // Fonction pour accepter une commande
  const acceptOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Commande acceptée');
        fetchOrders(); // Recharger les commandes
      } else {
        console.error('❌ Erreur lors de l\'acceptation de la commande');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // Fonction pour refuser une commande
  const rejectOrder = async (orderId, reason) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        console.log('✅ Commande refusée');
        fetchOrders(); // Recharger les commandes
      } else {
        console.error('❌ Erreur lors du refus de la commande');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // Fonction pour mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        console.log('✅ Statut de la commande mis à jour');
        fetchOrders(); // Recharger les commandes
      } else {
        console.error('❌ Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // Fonction pour filtrer les commandes
  const filterOrders = useCallback(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (activeTab === 'realtime') {
      filtered = filtered.filter(order => 
        ['pending', 'accepted', 'preparing', 'ready'].includes(order.status)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, activeTab]);

  // Effet pour filtrer les commandes quand les filtres changent
  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  // Effet pour charger les commandes au montage et toutes les 30 secondes
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Actualisation toutes les 30 secondes
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      accepted: '#2196f3',
      confirmed: '#9c27b0',
      preparing: '#9c27b0',
      ready: '#4caf50',
      delivered: '#2e7d32',
      completed: '#1b5e20',
      rejected: '#f44336',
      cancelled: '#d32f2f'
    };
    return colors[status] || '#757575';
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      accepted: 'Acceptée',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      delivered: 'Livrée',
      completed: 'Terminée',
      rejected: 'Refusée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-management">
        <div className="sidebar">
          <h3>Menu Restaurant</h3>
          <ul className="sidebar-menu">
            <li><Link to="/restaurant/dashboard">Dashboard</Link></li>
            <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
            <li><Link to="/restaurant/orders" className="active">Commandes</Link></li>
            <li><Link to="/restaurant/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <p>Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="sidebar">
        <h3>Menu Restaurant</h3>
        <ul className="sidebar-menu">
          <li><Link to="/restaurant/dashboard">Dashboard</Link></li>
          <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
          <li><Link to="/restaurant/orders" className="active">Commandes</Link></li>
          <li><Link to="/restaurant/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="order-header">
          <h1>Gestion des Commandes</h1>
          <p>Gérez vos commandes en temps réel</p>
        </div>

        {/* Statistiques rapides */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Total commandes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pendingOrders}</div>
            <div className="stat-label">En attente</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completedOrders}</div>
            <div className="stat-label">Terminées</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalRevenue}€</div>
            <div className="stat-label">Chiffre d'affaires</div>
          </div>
        </div>

        {/* Onglets */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'realtime' ? 'active' : ''}`}
            onClick={() => setActiveTab('realtime')}
          >
            Commandes en temps réel
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Historique
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
        </div>

        {/* Filtres */}
        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="accepted">Acceptée</option>
            <option value="preparing">En préparation</option>
            <option value="ready">Prête</option>
            <option value="delivered">Livrée</option>
            <option value="completed">Terminée</option>
            <option value="rejected">Refusée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'realtime' && (
          <div className="orders-section">
            <h2>Commandes en temps réel</h2>
            {filteredOrders.length === 0 ? (
              <div className="no-orders">
                <p>Aucune commande en cours</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <h3>Commande #{order._id.slice(-6)}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="order-details">
                      <p><strong>Client:</strong> {order.userId?.firstName} {order.userId?.lastName}</p>
                      <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                      <p><strong>Total:</strong> {order.totalPrice}€</p>
                    </div>

                    <div className="order-items">
                      <h4>Plats commandés:</h4>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity}x {item.dishId?.name} - {item.price}€
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-success"
                            onClick={() => acceptOrder(order._id)}
                          >
                            Accepter
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => rejectOrder(order._id, 'Indisponible')}
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      
                      {order.status === 'accepted' && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => updateOrderStatus(order._id, 'preparing')}
                        >
                          Commencer la préparation
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button 
                          className="btn btn-success"
                          onClick={() => updateOrderStatus(order._id, 'ready')}
                        >
                          Marquer comme prête
                        </button>
                      )}
                      
                      {order.status === 'ready' && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                        >
                          Marquer comme livrée
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h2>Historique des commandes</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>N° Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.userId?.firstName} {order.userId?.lastName}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.totalPrice}€</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-small"
                          onClick={() => console.log('Voir détails:', order._id)}
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>Statistiques de vente</h2>
            
            <div className="stats-controls">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-filter"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>

            <div className="stats-cards">
              <div className="stat-card-large">
                <h3>Chiffre d'affaires</h3>
                <div className="stat-value">{stats.totalRevenue}€</div>
                <div className="stat-change positive">+12.5% vs période précédente</div>
              </div>
              
              <div className="stat-card-large">
                <h3>Commandes moyennes</h3>
                <div className="stat-value">{stats.averageOrderValue}€</div>
                <div className="stat-change positive">+5.2% vs période précédente</div>
              </div>
              
              <div className="stat-card-large">
                <h3>Taux de conversion</h3>
                <div className="stat-value">
                  {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
                </div>
                <div className="stat-change positive">+2.1% vs période précédente</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Évolution des ventes</h3>
              <div className="chart-placeholder">
                <p>Graphique des ventes (à implémenter avec Chart.js ou Recharts)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement; 