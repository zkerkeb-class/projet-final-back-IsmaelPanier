import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrderTracking.css';

const API_BASE_URL = 'http://localhost:5000';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliverySimulation, setDeliverySimulation] = useState({
    driverName: '',
    vehicle: '',
    rating: 0,
    estimatedTime: 0,
    currentStatus: 'preparing',
    location: '',
    message: '',
    isSimulated: false
  });

  // États de la commande
  const orderStatuses = {
    pending: { label: 'En attente', icon: '⏳', color: 'warning' },
    accepted: { label: 'Commande acceptée', icon: '✅', color: 'success' },
    preparing: { label: 'En préparation', icon: '👨‍🍳', color: 'info' },
    ready: { label: 'Prête pour livraison', icon: '📦', color: 'primary' },
    picked_up: { label: 'En cours de livraison', icon: '🚚', color: 'primary' },
    delivered: { label: 'Livrée', icon: '🎉', color: 'success' },
    cancelled: { label: 'Annulée', icon: '❌', color: 'danger' },
    refused: { label: 'Refusée', icon: '🚫', color: 'danger' }
  };

  // Simulation des livreurs - mémorisé pour éviter les re-renders
  const drivers = useMemo(() => [
    { name: 'Mohammed', vehicle: 'Scooter', rating: 4.8 },
    { name: 'Sarah', vehicle: 'Vélo électrique', rating: 4.9 },
    { name: 'Ahmed', vehicle: 'Scooter', rating: 4.7 },
    { name: 'Emma', vehicle: 'Vélo électrique', rating: 4.6 }
  ], []);

  useEffect(() => {
    const updateOrderStatus = async (status) => {
      try {
        await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    };

    const simulateDeliverySteps = (totalTime) => {
      const steps = [
        { status: 'preparing', time: 0, location: 'Restaurant', message: 'Votre commande est en préparation' },
        { status: 'ready', time: totalTime * 0.3, location: 'Restaurant', message: 'Votre commande est prête' },
        { status: 'picked_up', time: totalTime * 0.4, location: 'En route', message: 'Le livreur a récupéré votre commande' },
        { status: 'delivered', time: totalTime, location: 'Chez vous', message: 'Votre commande a été livrée' }
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setDeliverySimulation(prev => ({
            ...prev,
            currentStatus: step.status,
            location: step.location,
            message: step.message
          }));

          // Mettre à jour le statut de la commande dans le backend
          if (step.status === 'delivered') {
            updateOrderStatus('delivered');
          }
        }, step.time * 1000); // Convertir en millisecondes
      });
    };

    const startDeliverySimulation = () => {
      const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
      const estimatedTime = Math.floor(Math.random() * 20) + 15; // 15-35 minutes

      setDeliverySimulation({
        driverName: randomDriver.name,
        vehicle: randomDriver.vehicle,
        rating: randomDriver.rating,
        estimatedTime,
        currentStatus: 'preparing',
        location: 'Restaurant',
        isSimulated: true
      });

      // Simulation des étapes de livraison
      simulateDeliverySteps(estimatedTime);
    };

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
          
          // Démarrer la simulation si la commande est en cours
          if (['pending', 'accepted', 'preparing', 'ready'].includes(orderData.status)) {
            startDeliverySimulation();
          }
        } else {
          console.error('Erreur lors de la récupération de la commande');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    const startOrderTracking = () => {
      const interval = setInterval(() => {
        fetchOrderDetails();
      }, 5000); // Vérifier toutes les 5 secondes

      return () => clearInterval(interval);
    };

    fetchOrderDetails();
    startOrderTracking();
  }, [orderId, token, drivers]);

  const cancelOrder = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setOrder(prev => ({ ...prev, status: 'cancelled' }));
        }
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    return orderStatuses[status]?.icon || '❓';
  };

  const getStatusColor = (status) => {
    return orderStatuses[status]?.color || 'secondary';
  };

  const getStatusLabel = (status) => {
    return orderStatuses[status]?.label || 'Statut inconnu';
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

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-page">
        <div className="error-container">
          <h2>Commande non trouvée</h2>
          <button onClick={() => navigate('/user/orders')} className="btn btn-primary">
            Retour à mes commandes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      <div className="tracking-container">
        {/* Header de la commande */}
        <div className="order-header">
          <div className="order-info">
            <h1>Commande #{order._id.slice(-8)}</h1>
            <p className="order-date">
              Passée le {formatDate(order.createdAt)}
            </p>
            <div className="order-restaurant">
              <h3>{order.restaurant?.name || 'Restaurant'}</h3>
              <p>{order.restaurant?.address || 'Adresse du restaurant'}</p>
            </div>
          </div>
          
          <div className="order-actions">
            {order.status === 'pending' && (
              <button onClick={cancelOrder} className="btn btn-danger">
                Annuler la commande
              </button>
            )}
            <button onClick={() => navigate('/user/orders')} className="btn btn-secondary">
              Retour aux commandes
            </button>
          </div>
        </div>

        {/* Statut actuel */}
        <div className="current-status">
          <div className={`status-card ${getStatusColor(order.status)}`}>
            <div className="status-icon">
              {getStatusIcon(order.status)}
            </div>
            <div className="status-info">
              <h2>{getStatusLabel(order.status)}</h2>
              {deliverySimulation.isSimulated && deliverySimulation.message && (
                <p>{deliverySimulation.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline de la commande */}
        <div className="order-timeline">
          <h3>Suivi de votre commande</h3>
          <div className="timeline">
            {Object.entries(orderStatuses).map(([status, statusInfo]) => {
              const isCompleted = order.status === status || 
                (status === 'pending' && order.status !== 'pending') ||
                (status === 'accepted' && ['preparing', 'ready', 'picked_up', 'delivered'].includes(order.status)) ||
                (status === 'preparing' && ['ready', 'picked_up', 'delivered'].includes(order.status)) ||
                (status === 'ready' && ['picked_up', 'delivered'].includes(order.status)) ||
                (status === 'picked_up' && order.status === 'delivered');

              const isCurrent = order.status === status;

              return (
                <div key={status} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="timeline-icon">
                    {isCompleted ? '✅' : isCurrent ? statusInfo.icon : '⭕'}
                  </div>
                  <div className="timeline-content">
                    <h4>{statusInfo.label}</h4>
                    {isCurrent && deliverySimulation.isSimulated && (
                      <p className="timeline-details">
                        {deliverySimulation.location} • {deliverySimulation.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations du livreur (si en cours de livraison) */}
        {deliverySimulation.isSimulated && ['picked_up', 'delivered'].includes(deliverySimulation.currentStatus) && (
          <div className="driver-info">
            <h3>Votre livreur</h3>
            <div className="driver-card">
              <div className="driver-avatar">
                👤
              </div>
              <div className="driver-details">
                <h4>{deliverySimulation.driverName}</h4>
                <p>🚗 {deliverySimulation.vehicle}</p>
                <p>⭐ {deliverySimulation.rating}/5</p>
                <p>📍 {deliverySimulation.location}</p>
              </div>
              <div className="driver-actions">
                <button className="btn btn-outline">📞 Appeler</button>
                <button className="btn btn-outline">💬 Message</button>
              </div>
            </div>
          </div>
        )}

        {/* Détails de la commande */}
        <div className="order-details">
          <h3>Détails de votre commande</h3>
          <div className="order-items">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-options">
                    {item.selectedOptions?.join(', ')}
                  </p>
                </div>
                <div className="item-quantity">
                  x{item.quantity}
                </div>
                <div className="item-price">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Sous-total:</span>
              <span>{order.totalAmount?.toFixed(2)}€</span>
            </div>
            <div className="summary-row">
              <span>Frais de livraison:</span>
              <span>2.50€</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{(order.totalAmount + 2.50).toFixed(2)}€</span>
            </div>
          </div>

          <div className="delivery-info">
            <h4>Adresse de livraison</h4>
            <p>{order.deliveryAddress}</p>
            {order.specialInstructions && (
              <>
                <h4>Instructions spéciales</h4>
                <p>{order.specialInstructions}</p>
              </>
            )}
          </div>
        </div>

        {/* Estimation du temps de livraison */}
        {deliverySimulation.isSimulated && deliverySimulation.estimatedTime > 0 && (
          <div className="delivery-estimate">
            <h3>Temps de livraison estimé</h3>
            <div className="estimate-card">
              <div className="estimate-time">
                <span className="time-display">{deliverySimulation.estimatedTime} min</span>
                <p>Temps restant estimé</p>
              </div>
              <div className="estimate-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(100, (deliverySimulation.estimatedTime / 35) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 