import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔌 Initialisation de la connexion Socket.io...');
      
      // Créer la connexion Socket.io
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      // Événements de connexion
      newSocket.on('connect', () => {
        console.log('✅ Connecté au serveur Socket.io:', newSocket.id);
        setIsConnected(true);
        
        // Rejoindre la room utilisateur
        newSocket.emit('join-user', {
          userId: user.id || user._id,
          userType: user.role
        });
        
        console.log(`👤 Utilisateur rejoint: ${user.email} (${user.role})`);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Déconnecté du serveur Socket.io');
        setIsConnected(false);
      });

      // Notifications pour les restaurants
      if (user.role === 'restaurant') {
        // Succès d'ajout de plat
        newSocket.on('dish-added-success', (data) => {
          console.log('🍽️ Plat ajouté avec succès:', data);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });

        // Succès de modification de plat
        newSocket.on('dish-updated-success', (data) => {
          console.log('🔄 Plat modifié avec succès:', data);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        });

        // Succès de suppression de plat
        newSocket.on('dish-deleted-success', (data) => {
          console.log('🗑️ Plat supprimé avec succès:', data);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        });

        // Nouvelle commande reçue
        newSocket.on('new-order', (data) => {
          console.log('🛍️ Nouvelle commande reçue:', data);
          toast.info(`🛍️ Nouvelle commande reçue !`, {
            position: "top-right",
            autoClose: 5000,
          });
        });

        // Utilisateur connecté
        newSocket.on('user-online', (data) => {
          console.log('👋 Utilisateur connecté:', data);
          toast.info(`👋 ${data.userName} vient de se connecter`, {
            position: "bottom-right",
            autoClose: 2000,
          });
        });
      }

      // Notifications pour les utilisateurs
      if (user.role === 'user') {
        // Nouveau plat ajouté
        newSocket.on('dish-added', (data) => {
          console.log('🍽️ Nouveau plat disponible:', data);
          toast.info(`🍽️ Nouveau plat: "${data.dish.name}" disponible !`, {
            position: "top-right",
            autoClose: 4000,
          });
        });

        // Plat modifié
        newSocket.on('dish-updated', (data) => {
          console.log('🔄 Plat mis à jour:', data);
          toast.info(`🔄 Plat "${data.dish.name}" mis à jour`, {
            position: "top-right",
            autoClose: 3000,
          });
        });

        // Restaurant en ligne
        newSocket.on('restaurant-online', (data) => {
          console.log('🏪 Restaurant connecté:', data);
          toast.success(`🏪 ${data.userName} est maintenant en ligne !`, {
            position: "bottom-right",
            autoClose: 3000,
          });
        });

        // Statut de commande mis à jour
        newSocket.on('order-status-updated', (data) => {
          console.log('📦 Statut de commande mis à jour:', data);
          toast.info(data.message, {
            position: "top-center",
            autoClose: 5000,
          });
        });
      }

      // Gestion des erreurs
      newSocket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion Socket.io:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Nettoyage à la déconnexion
      return () => {
        console.log('🔌 Fermeture de la connexion Socket.io');
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected,
    // Méthodes utilitaires
    emitDishAdded: (restaurantId, dish) => {
      if (socket && user?.role === 'restaurant') {
        socket.emit('dish-added', { restaurantId, dish });
      }
    },
    emitDishUpdated: (restaurantId, dish) => {
      if (socket && user?.role === 'restaurant') {
        socket.emit('dish-updated', { restaurantId, dish });
      }
    },
    emitDishDeleted: (restaurantId, dishName) => {
      if (socket && user?.role === 'restaurant') {
        socket.emit('dish-deleted', { restaurantId, dishName });
      }
    },
    emitOrderPlaced: (restaurantId, order) => {
      if (socket && user?.role === 'user') {
        socket.emit('order-placed', { restaurantId, order });
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 