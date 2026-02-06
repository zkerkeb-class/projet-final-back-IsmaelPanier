import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const API_BASE_URL = 'http://localhost:5000';

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current'); // current, history
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalSpent: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        calculateStats(data);
      } else {
        // Données mock pour la démo
        const mockOrders = [
          {
            _id: '1',
            restaurantId: { name: 'Bella Pizza', _id: 'rest1' },
            items: [
              { name: 'Pizza Margherita', quantity: 1, price: 12.50 },
              { name: 'Coca Cola', quantity: 2, price: 2.50 }
            ],
            totalAmount: 17.50,
            status: 'pending',
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString()
          },
          {
            _id: '2',
            restaurantId: { name: 'Sushi Master', _id: 'rest2' },
            items: [
              { name: 'Menu Saumon', quantity: 1, price: 18.90 }
            ],
            totalAmount: 18.90,
            status: 'delivered',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60000).toISOString()
          }
        ];
        setOrders(mockOrders);
        calculateStats(mockOrders);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const calculateStats = (ordersList) => {
    const stats = {
      total: ordersList.length,
      pending: ordersList.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length,
      completed: ordersList.filter(o => o.status === 'delivered').length,
      totalSpent: ordersList.reduce((sum, order) => sum + order.totalAmount, 0)
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'preparing': return '#8b5cf6';
      case 'ready': return '#10b981';
      case 'on_way': return '#06b6d4';
      case 'delivered': return '#22c55e';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'on_way': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Commande annulée avec succès');
        fetchOrders(); // Recharger les commandes
      } else {
        toast.error('Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('❌ Erreur annulation:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const currentOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready', 'on_way'].includes(order.status)
  );

  const historyOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Mes Commandes</h1>
        <p>Suivez vos commandes en temps réel</p>
      </div>

      {/* Statistiques */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total commandes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>En cours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Livrées</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.totalSpent.toFixed(2)}€</h3>
            <p>Total dépensé</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="orders-tabs">
        <button 
          className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Commandes en cours ({currentOrders.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historique ({historyOrders.length})
        </button>
      </div>

      {/* Liste des commandes */}
      <div className="orders-list">
        {activeTab === 'current' && (
          <>
            {currentOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛍️</div>
                <h3>Aucune commande en cours</h3>
                <p>Vos commandes actives apparaîtront ici</p>
              </div>
            ) : (
              currentOrders.map(order => (
                <div key={order._id} className="order-card current">
                  <div className="order-header">
                    <div className="order-restaurant">
                      <h3>{order.restaurantId?.name || 'Restaurant'}</h3>
                      <span className="order-id">#{order._id}</span>
                    </div>
                    <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(order.status) }}></span>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">x{item.quantity} - {(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-info">
                      <p className="order-date">Commandé le {formatDate(order.createdAt)}</p>
                      {order.estimatedDelivery && (
                        <p className="order-eta">Livraison estimée: {formatDate(order.estimatedDelivery)}</p>
                      )}
                    </div>
                    <div className="order-actions">
                      <span className="order-total">{order.totalAmount.toFixed(2)}€</span>
                      {order.status === 'pending' && (
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {historyOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Aucun historique</h3>
                <p>Vos commandes passées apparaîtront ici</p>
              </div>
            ) : (
              historyOrders.map(order => (
                <div key={order._id} className="order-card history">
                  <div className="order-header">
                    <div className="order-restaurant">
                      <h3>{order.restaurantId?.name || 'Restaurant'}</h3>
                      <span className="order-id">#{order._id}</span>
                    </div>
                    <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(order.status) }}></span>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">x{item.quantity} - {(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-info">
                      <p className="order-date">Commandé le {formatDate(order.createdAt)}</p>
                      {order.deliveredAt && (
                        <p className="order-delivered">Livré le {formatDate(order.deliveredAt)}</p>
                      )}
                    </div>
                    <div className="order-actions">
                      <span className="order-total">{order.totalAmount.toFixed(2)}€</span>
                      <button className="reorder-btn">
                        Recommander
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders; 