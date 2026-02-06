import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './NotificationBell.css';

const API_BASE_URL = 'http://localhost:5000';

const NotificationBell = () => {
  const { user, token } = useAuth();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (user?.role === 'restaurant' && token) {
      fetchPendingOrders();
      // Actualiser toutes les 30 secondes
      const interval = setInterval(fetchPendingOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/restaurant`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const orders = await response.json();
        const pending = orders.filter(order => order.status === 'pending');
        setPendingOrders(pending.length);
        
        // Garder les 5 commandes les plus récentes
        const recent = orders
          .filter(order => ['pending', 'accepted', 'preparing'].includes(order.status))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentOrders(recent);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      accepted: 'Acceptée',
      preparing: 'En préparation'
    };
    return texts[status] || status;
  };

  if (user?.role !== 'restaurant') {
    return null;
  }

  return (
    <div className="notification-bell">
      <div 
        className="bell-icon"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {pendingOrders > 0 && (
          <span className="notification-badge">{pendingOrders}</span>
        )}
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {pendingOrders > 0 && (
              <span className="pending-count">{pendingOrders} en attente</span>
            )}
          </div>
          
          <div className="notification-list">
            {recentOrders.length === 0 ? (
              <div className="no-notifications">
                <p>Aucune commande récente</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="notification-item">
                  <div className="notification-content">
                    <div className="notification-title">
                      Commande #{order._id.slice(-6)}
                    </div>
                    <div className="notification-details">
                      <span className="status">{getStatusText(order.status)}</span>
                      <span className="time">{formatTime(order.createdAt)}</span>
                    </div>
                    <div className="notification-price">
                      {order.totalPrice}€
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="notification-footer">
            <button 
              className="view-all-btn"
              onClick={() => {
                setShowNotifications(false);
                window.location.href = '/restaurant/orders';
              }}
            >
              Voir toutes les commandes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 