// src/module/restaurants/restaurants.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from '../restaurants/schemas/restaurant.schema';
import { Model, Types } from 'mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant-dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  // Récupérer tous les restaurants (pour les utilisateurs)
  async getAllRestaurants(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find().exec();
    console.log('📋 Tous les restaurants récupérés:', restaurants.length);
    
    // Si aucun restaurant, créer des données de test
    if (restaurants.length === 0) {
      console.log('🔄 Aucun restaurant trouvé, création de données de test...');
      await this.createSampleRestaurants();
      return await this.restaurantModel.find().exec();
    }
    
    return restaurants;
  }

  // Récupérer un restaurant par ID (pour les utilisateurs)
  async getRestaurantById(id: string): Promise<Restaurant> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid restaurant ID');
    }

    const restaurant = await this.restaurantModel.findById(id).exec();
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant non trouvé');
    }

    console.log('📋 Restaurant récupéré par ID:', id);
    return restaurant;
  }

  async createRestaurant(dto: CreateRestaurantDto, ownerId: string): Promise<Restaurant> {
    if (!Types.ObjectId.isValid(ownerId)) {
      throw new BadRequestException('Invalid ownerId');
    }

    const restaurant = new this.restaurantModel({
      ...dto,
      ownerId: new Types.ObjectId(ownerId),
    });

    console.log('✅ Nouveau restaurant créé :', restaurant);
    return restaurant.save();
  }

  async updateMyRestaurant(
    ownerId: string,
    dto: Partial<UpdateRestaurantDto>,
  ): Promise<Restaurant> {
    const updated = await this.restaurantModel.findOneAndUpdate(
      { ownerId: new Types.ObjectId(ownerId) },
      { $set: dto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Restaurant non trouvé pour ce propriétaire');
    }

    console.log('🛠️ Restaurant mis à jour pour ownerId:', ownerId);
    console.log('📦 Nouvelle version:', updated);

    return updated;
  }

  async getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | null> {
    const restaurant = await this.restaurantModel.findOne({ ownerId: new Types.ObjectId(ownerId) }).exec();

    if (!restaurant) {
      console.log('📥 Aucun restaurant trouvé pour ownerId:', ownerId);
      return null;
    }

    console.log('📥 Restaurant récupéré pour ownerId:', ownerId);
    console.log('📋 Infos :', restaurant);

    return restaurant;
  }

  // Créer des restaurants de test
  private async createSampleRestaurants(): Promise<void> {
    // Créer des ObjectId valides pour les restaurants de test
    const validObjectIds = [
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId()
    ];

    const sampleRestaurants = [
      {
        _id: validObjectIds[0], // Utiliser un ObjectId valide
        name: 'Pizza Palace',
        description: 'Les meilleures pizzas de la ville avec des ingrédients frais et locaux',
        cuisine: 'Italienne',
        address: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        phone: '+33 1 23 45 67 89',
        email: 'contact@pizzapalace.fr',
        priceRange: 'Moyen',
        rating: 4.5,
        deliveryTime: 30,
        minOrderAmount: 15,
        isOpen: true,
        openingHours: {
          monday: '11:00-23:00',
          tuesday: '11:00-23:00',
          wednesday: '11:00-23:00',
          thursday: '11:00-23:00',
          friday: '11:00-00:00',
          saturday: '11:00-00:00',
          sunday: '12:00-22:00'
        },
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439011'), // ID fictif
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        _id: validObjectIds[1], // Utiliser un ObjectId valide
        name: 'Sushi Express',
        description: 'Sushis frais et authentiques préparés par nos chefs japonais',
        cuisine: 'Japonaise',
        address: {
          street: '456 Avenue des Champs',
          city: 'Paris',
          postalCode: '75008',
          country: 'France'
        },
        phone: '+33 1 98 76 54 32',
        email: 'info@sushiexpress.fr',
        priceRange: 'Élevé',
        rating: 4.8,
        deliveryTime: 25,
        minOrderAmount: 20,
        isOpen: true,
        openingHours: {
          monday: '12:00-22:30',
          tuesday: '12:00-22:30',
          wednesday: '12:00-22:30',
          thursday: '12:00-22:30',
          friday: '12:00-23:30',
          saturday: '12:00-23:30',
          sunday: '12:00-21:30'
        },
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439012'), // ID fictif
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        _id: validObjectIds[2], // Utiliser un ObjectId valide
        name: 'Burger House',
        description: 'Burgers gourmets avec des viandes de qualité et des frites maison',
        cuisine: 'Américaine',
        address: {
          street: '789 Boulevard Saint-Germain',
          city: 'Paris',
          postalCode: '75006',
          country: 'France'
        },
        phone: '+33 1 45 67 89 01',
        email: 'hello@burgerhouse.fr',
        priceRange: 'Économique',
        rating: 4.2,
        deliveryTime: 20,
        minOrderAmount: 12,
        isOpen: true,
        openingHours: {
          monday: '11:30-22:00',
          tuesday: '11:30-22:00',
          wednesday: '11:30-22:00',
          thursday: '11:30-22:00',
          friday: '11:30-23:00',
          saturday: '11:30-23:00',
          sunday: '12:00-21:00'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439013'), // ID fictif
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        _id: validObjectIds[3], // Utiliser un ObjectId valide
        name: 'Le Bistrot Français',
        description: 'Cuisine française traditionnelle dans un cadre chaleureux',
        cuisine: 'Française',
        address: {
          street: '321 Rue du Faubourg',
          city: 'Paris',
          postalCode: '75011',
          country: 'France'
        },
        phone: '+33 1 34 56 78 90',
        email: 'reservation@bistrotfrancais.fr',
        priceRange: 'Élevé',
        rating: 4.6,
        deliveryTime: 35,
        minOrderAmount: 25,
        isOpen: true,
        openingHours: {
          monday: '12:00-14:30, 19:00-22:30',
          tuesday: '12:00-14:30, 19:00-22:30',
          wednesday: '12:00-14:30, 19:00-22:30',
          thursday: '12:00-14:30, 19:00-22:30',
          friday: '12:00-14:30, 19:00-23:00',
          saturday: '12:00-14:30, 19:00-23:00',
          sunday: 'Fermé'
        },
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439014'), // ID fictif
        deliveryOptions: ['Livraison'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        _id: validObjectIds[4], // Utiliser un ObjectId valide
        name: 'Taj Mahal',
        description: 'Cuisine indienne épicée et authentique',
        cuisine: 'Indienne',
        address: {
          street: '654 Rue de la Roquette',
          city: 'Paris',
          postalCode: '75012',
          country: 'France'
        },
        phone: '+33 1 99 88 77 66',
        email: 'taj.mahal@example.com',
        priceRange: 'Moyen',
        rating: 4.4,
        deliveryTime: 25,
        minOrderAmount: 18,
        isOpen: true,
        openingHours: {
          monday: '12:00-14:30, 19:00-22:30',
          tuesday: '12:00-14:30, 19:00-22:30',
          wednesday: '12:00-14:30, 19:00-22:30',
          thursday: '12:00-14:30, 19:00-22:30',
          friday: '12:00-14:30, 19:00-23:00',
          saturday: '12:00-23:00',
          sunday: '12:00-21:00'
        },
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439015'), // ID fictif
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      }
    ];

    try {
      await this.restaurantModel.insertMany(sampleRestaurants);
      console.log('✅ Restaurants de test créés avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la création des restaurants de test:', error);
    }
  }
}
