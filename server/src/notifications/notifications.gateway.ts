import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');
  private connectedUsers = new Map<string, { socket: Socket, userType: string, userId: string }>();

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Client déconnecté: ${client.id}`);
    
    // Supprimer l'utilisateur de la liste des connectés
    for (const [userId, userData] of this.connectedUsers.entries()) {
      if (userData.socket.id === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.log(`👤 Utilisateur ${userId} supprimé de la liste des connectés`);
        break;
      }
    }
  }

  @SubscribeMessage('join-user')
  handleJoinUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string, userType: 'restaurant' | 'user' }
  ) {
    this.logger.log(`👤 Utilisateur rejoint: ${data.userId} (${data.userType})`);
    
    this.connectedUsers.set(data.userId, {
      socket: client,
      userType: data.userType,
      userId: data.userId
    });
    
    // Joindre la room correspondant au type d'utilisateur
    client.join(`${data.userType}s`);
    client.join(`user_${data.userId}`);
    
    this.logger.log(`📱 Utilisateur ${data.userId} rejoint les rooms: ${data.userType}s, user_${data.userId}`);
  }

  // Notifier tous les clients
  notifyAll(event: string, data: any) {
    this.logger.log(`📢 Notification globale: ${event}`);
    this.server.emit(event, data);
  }

  // Notifier un utilisateur spécifique
  notifyUser(userId: string, event: string, data: any) {
    const userData = this.connectedUsers.get(userId);
    if (userData) {
      this.logger.log(`📤 Notification privée pour ${userId}: ${event}`);
      userData.socket.emit(event, data);
    } else {
      this.logger.warn(`⚠️ Utilisateur ${userId} non connecté`);
    }
  }

  // Notifier tous les restaurants
  notifyRestaurants(event: string, data: any) {
    this.logger.log(`🏪 Notification restaurants: ${event}`);
    this.server.to('restaurants').emit(event, data);
  }

  // Notifier tous les clients (utilisateurs finaux)
  notifyClients(event: string, data: any) {
    this.logger.log(`👥 Notification clients: ${event}`);
    this.server.to('users').emit(event, data);
  }

  // Notifier un restaurant spécifique
  notifyRestaurant(restaurantId: string, event: string, data: any) {
    this.logger.log(`🏪 Notification restaurant ${restaurantId}: ${event}`);
    this.server.to(`user_${restaurantId}`).emit(event, data);
  }

  // Événements de plats
  dishAdded(restaurantId: string, dish: any) {
    const notificationData = {
      type: 'dish_added',
      message: `🍽️ Nouveau plat: "${dish.name}" ajouté par le restaurant`,
      dish: dish,
      restaurantId: restaurantId,
      timestamp: new Date().toISOString()
    };

    // Notifier tous les clients
    this.notifyClients('dish-added', notificationData);
    
    // Notifier le restaurant spécifique
    this.notifyRestaurant(restaurantId, 'dish-added-success', {
      type: 'success',
      message: `✅ Plat "${dish.name}" ajouté avec succès !`,
      dish: dish
    });
  }

  dishUpdated(restaurantId: string, dish: any) {
    const notificationData = {
      type: 'dish_updated',
      message: `🔄 Plat "${dish.name}" mis à jour`,
      dish: dish,
      restaurantId: restaurantId,
      timestamp: new Date().toISOString()
    };

    this.notifyClients('dish-updated', notificationData);
    this.notifyRestaurant(restaurantId, 'dish-updated-success', {
      type: 'success',
      message: `✅ Plat "${dish.name}" mis à jour !`,
      dish: dish
    });
  }

  dishDeleted(restaurantId: string, dishName: string) {
    const notificationData = {
      type: 'dish_deleted',
      message: `🗑️ Plat "${dishName}" supprimé`,
      dishName: dishName,
      restaurantId: restaurantId,
      timestamp: new Date().toISOString()
    };

    this.notifyClients('dish-deleted', notificationData);
    this.notifyRestaurant(restaurantId, 'dish-deleted-success', {
      type: 'success',
      message: `✅ Plat "${dishName}" supprimé !`
    });
  }

  // Événements de connexion
  userConnected(userId: string, userType: string, userName: string) {
    const notificationData = {
      type: 'user_connected',
      message: `👋 ${userName} (${userType}) vient de se connecter`,
      userId: userId,
      userType: userType,
      userName: userName,
      timestamp: new Date().toISOString()
    };

    if (userType === 'restaurant') {
      this.notifyClients('restaurant-online', notificationData);
    } else {
      this.notifyRestaurants('user-online', notificationData);
    }
  }

  // Événements de commande
  orderPlaced(restaurantId: string, order: any) {
    const notificationData = {
      type: 'new_order',
      message: `🛍️ Nouvelle commande reçue !`,
      order: order,
      timestamp: new Date().toISOString()
    };

    this.notifyRestaurant(restaurantId, 'new-order', notificationData);
  }

  orderStatusUpdated(userId: string, order: any) {
    const notificationData = {
      type: 'order_status_updated',
      message: `📦 Votre commande est maintenant: ${order.status}`,
      order: order,
      timestamp: new Date().toISOString()
    };

    this.notifyUser(userId, 'order-status-updated', notificationData);
  }
} 