import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrderHistory.css';

const API_BASE_URL = 'http://localhost:5000';

const OrderHistory = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Statuts disponibles
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'accepted', label: 'Acceptée' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'ready', label: 'Prête' },
    { value: 'picked_up', label: 'En livraison' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
    { value: 'refused', label: 'Refusée' }
  ];

  // Périodes disponibles
  const periodOptions = [
    { value: 'all', label: 'Toutes les commandes' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === '' || order.status === selectedStatus;
    const matchesSearch = order.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          matchesPeriod = orderDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = orderDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
          matchesPeriod = orderDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getFullYear(), 0, 1);
          matchesPeriod = orderDate >= yearAgo;
          break;
        default:
          matchesPeriod = true;
      }
    }
    
    return matchesStatus && matchesSearch && matchesPeriod;
  });

  // Trier les commandes par date (plus récentes en premier)
  const sortedOrders = filteredOrders.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: '⏳',
      accepted: '✅',
      preparing: '👨‍🍳',
      ready: '📦',
      picked_up: '🚚',
      delivered: '🎉',
      cancelled: '❌',
      refused: '🚫'
    };
    return statusIcons[status] || '❓';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      accepted: 'success',
      preparing: 'info',
      ready: 'primary',
      picked_up: 'primary',
      delivered: 'success',
      cancelled: 'danger',
      refused: 'danger'
    };
    return statusColors[status] || 'secondary';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'En attente',
      accepted: 'Commande acceptée',
      preparing: 'En préparation',
      ready: 'Prête pour livraison',
      picked_up: 'En cours de livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      refused: 'Refusée'
    };
    return statusLabels[status] || 'Statut inconnu';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderSummary = (items) => {
    if (!items || items.length === 0) return 'Aucun article';
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const firstItem = items[0];
    
    if (items.length === 1) {
      return `${firstItem.name} x${firstItem.quantity}`;
    } else {
      return `${firstItem.name} +${items.length - 1} autre(s) (${totalItems} articles)`;
    }
  };

  const repeatOrder = async (orderId) => {
    try {
      // Récupérer les détails de la commande
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const order = await response.json();
        // Rediriger vers le restaurant avec les articles pré-sélectionnés
        navigate(`/user/restaurant/${order.restaurantId}?repeat=${orderId}`);
      }
    } catch (error) {
      console.error('Erreur lors de la répétition de commande:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="sidebar">
          <h3>Menu Client</h3>
          <ul className="sidebar-menu">
            <li><Link to="/user/dashboard">Accueil</Link></li>
            <li><Link to="/user/restaurants">Restaurants</Link></li>
            <li><Link to="/user/orders" className="active">Mes Commandes</Link></li>
            <li><Link to="/user/favorites">Favoris</Link></li>
            <li><Link to="/user/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Menu Client</h3>
        <ul className="sidebar-menu">
          <li><Link to="/user/dashboard">Accueil</Link></li>
          <li><Link to="/user/restaurants">Restaurants</Link></li>
          <li><Link to="/user/orders" className="active">Mes Commandes</Link></li>
          <li><Link to="/user/favorites">Favoris</Link></li>
          <li><Link to="/user/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Historique des commandes</h1>
          <p>Retrouvez toutes vos commandes passées</p>
        </div>

        {/* Filtres */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher par restaurant ou numéro de commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="filter-select"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="orders-list">
          {sortedOrders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📋</div>
              <h3>Aucune commande trouvée</h3>
              <p>
                {searchTerm || selectedStatus || selectedPeriod !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Vous n\'avez pas encore passé de commande'
                }
              </p>
              {!searchTerm && selectedStatus === '' && selectedPeriod === 'all' && (
                <Link to="/user/restaurants" className="btn btn-primary">
                  Découvrir nos restaurants
                </Link>
              )}
            </div>
          ) : (
            <>
              {sortedOrders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Commande #{order._id.slice(-8)}</h3>
                      <p className="order-date">
                        {formatDate(order.createdAt)} à {formatTime(order.createdAt)}
                      </p>
                      <p className="order-restaurant">
                        {order.restaurant?.name || 'Restaurant'}
                      </p>
                    </div>
                    
                    <div className="order-status">
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-content">
                    <div className="order-summary">
                      <p className="order-items">
                        {getOrderSummary(order.items)}
                      </p>
                      <p className="order-total">
                        Total: {order.totalAmount?.toFixed(2)}€
                      </p>
                    </div>

                    <div className="order-actions">
                      <Link 
                        to={`/user/orders/${order._id}`} 
                        className="btn btn-secondary"
                      >
                        Voir les détails
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <button 
                          className="btn btn-outline"
                          onClick={() => repeatOrder(order._id)}
                        >
                          Commander à nouveau
                        </button>
                      )}
                      
                      {order.status === 'pending' && (
                        <Link 
                          to={`/user/orders/${order._id}`} 
                          className="btn btn-primary"
                        >
                          Suivre la commande
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="orders-summary">
                <p>
                  {sortedOrders.length} commande(s) trouvée(s)
                  {selectedPeriod !== 'all' && ` pour ${periodOptions.find(p => p.value === selectedPeriod)?.label.toLowerCase()}`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory; 