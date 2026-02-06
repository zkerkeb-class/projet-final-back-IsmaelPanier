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
    try {
      console.log('🔍 Récupération de tous les restaurants depuis MongoDB...');
      const restaurants = await this.restaurantModel.find().exec();
      console.log('📋 Restaurants trouvés dans la DB:', restaurants.length);
      
      // Si aucun restaurant, retourner une liste vide (normal)
      if (restaurants.length === 0) {
        console.log('📭 Aucun restaurant trouvé dans la base de données (normal)');
        return [];
      }
      
      return restaurants;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des restaurants:', error);
      
      // En cas d'erreur de base de données, créer des données de test
      console.log('🔄 Erreur DB, création de données de test...');
      try {
        await this.createSampleRestaurants();
        const testRestaurants = await this.restaurantModel.find().exec();
        console.log('📋 Données de test créées:', testRestaurants.length);
        return testRestaurants;
      } catch (testError) {
        console.error('❌ Erreur lors de la création des données de test:', testError);
        return [];
      }
    }
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
        address: '123 Rue de la Paix, 75001 Paris',
        phone: '+33 1 23 45 67 89',
        email: 'contact@pizzapalace.fr',
        priceRange: 'medium',
        rating: 4.5,
        deliveryTime: 30,
        minimumOrder: 15,
        isOpen: true,
        openingHours: {
          monday: { open: '11:00', close: '23:00' },
          tuesday: { open: '11:00', close: '23:00' },
          wednesday: { open: '11:00', close: '23:00' },
          thursday: { open: '11:00', close: '23:00' },
          friday: { open: '11:00', close: '00:00' },
          saturday: { open: '11:00', close: '00:00' },
          sunday: { open: '12:00', close: '22:00' }
        },
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439011') // ID fictif
      },
      {
        _id: validObjectIds[1], // Utiliser un ObjectId valide
        name: 'Sushi Express',
        description: 'Sushis frais et authentiques préparés par nos chefs japonais',
        cuisine: 'Japonaise',
        address: '456 Avenue des Champs, 75008 Paris',
        phone: '+33 1 98 76 54 32',
        email: 'info@sushiexpress.fr',
        priceRange: 'high',
        rating: 4.8,
        deliveryTime: 25,
        minimumOrder: 20,
        isOpen: true,
        openingHours: {
          monday: { open: '12:00', close: '22:30' },
          tuesday: { open: '12:00', close: '22:30' },
          wednesday: { open: '12:00', close: '22:30' },
          thursday: { open: '12:00', close: '22:30' },
          friday: { open: '12:00', close: '23:30' },
          saturday: { open: '12:00', close: '23:30' },
          sunday: { open: '12:00', close: '21:30' }
        },
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439012') // ID fictif
      },
      {
        _id: validObjectIds[2], // Utiliser un ObjectId valide
        name: 'Burger House',
        description: 'Burgers gourmets avec des viandes de qualité et des frites maison',
        cuisine: 'Américaine',
        address: '789 Boulevard Saint-Germain, 75006 Paris',
        phone: '+33 1 45 67 89 01',
        email: 'hello@burgerhouse.fr',
        priceRange: 'low',
        rating: 4.2,
        deliveryTime: 20,
        minimumOrder: 12,
        isOpen: true,
        openingHours: {
          monday: { open: '11:30', close: '22:00' },
          tuesday: { open: '11:30', close: '22:00' },
          wednesday: { open: '11:30', close: '22:00' },
          thursday: { open: '11:30', close: '22:00' },
          friday: { open: '11:30', close: '23:00' },
          saturday: { open: '11:30', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439013') // ID fictif
      },
      {
        _id: validObjectIds[3], // Utiliser un ObjectId valide
        name: 'Le Bistrot Français',
        description: 'Cuisine française traditionnelle dans un cadre authentique',
        cuisine: 'Française',
        address: '321 Rue du Faubourg, 75011 Paris',
        phone: '+33 1 55 66 77 88',
        email: 'bistrot@francais.fr',
        priceRange: 'high',
        rating: 4.7,
        deliveryTime: 35,
        minimumOrder: 25,
        isOpen: true,
        openingHours: {
          monday: { open: '12:00', close: '22:30' },
          tuesday: { open: '12:00', close: '22:30' },
          wednesday: { open: '12:00', close: '22:30' },
          thursday: { open: '12:00', close: '22:30' },
          friday: { open: '12:00', close: '23:00' },
          saturday: { open: '12:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        },
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439014') // ID fictif
      },
      {
        _id: validObjectIds[4], // Utiliser un ObjectId valide
        name: 'Taj Mahal',
        description: 'Cuisine indienne authentique avec des épices traditionnelles',
        cuisine: 'Indienne',
        address: '654 Rue de la Roquette, 75012 Paris',
        phone: '+33 1 99 88 77 66',
        email: 'taj@mahal.fr',
        priceRange: 'medium',
        rating: 4.4,
        deliveryTime: 30,
        minimumOrder: 18,
        isOpen: true,
        openingHours: {
          monday: { open: '12:00', close: '22:30' },
          tuesday: { open: '12:00', close: '22:30' },
          wednesday: { open: '12:00', close: '22:30' },
          thursday: { open: '12:00', close: '22:30' },
          friday: { open: '12:00', close: '23:00' },
          saturday: { open: '12:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        },
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        ownerId: new Types.ObjectId('507f1f77bcf86cd799439015') // ID fictif
      }
    ];

    try {
      await this.restaurantModel.insertMany(sampleRestaurants);
      console.log('✅ Restaurants de test créés avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la création des restaurants de test:', error);
    }
  }

  // Supprimer tous les restaurants de test
  async clearAllRestaurants(): Promise<void> {
    try {
      console.log('🗑️ Suppression de tous les restaurants...');
      const result = await this.restaurantModel.deleteMany({}).exec();
      console.log(`✅ ${result.deletedCount} restaurants supprimés`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des restaurants:', error);
      throw error;
    }
  }

  // Supprimer seulement les restaurants de test (avec des ownerId fictifs)
  async clearTestRestaurants(): Promise<void> {
    try {
      console.log('🗑️ Suppression des restaurants de test...');
      
      // Liste des ownerId fictifs utilisés dans les tests
      const testOwnerIds = [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012', 
        '507f1f77bcf86cd799439013',
        '507f1f77bcf86cd799439014',
        '507f1f77bcf86cd799439015',
        '6859bde9131ecca0c8303526',
        '6859bde9131ecca0c8303528',
        '6859bde9131ecca0c830352a',
        '6859bde9131ecca0c830352c',
        '6859bde9131ecca0c830352e'
      ];

      const result = await this.restaurantModel.deleteMany({
        ownerId: { $in: testOwnerIds.map(id => new Types.ObjectId(id)) }
      }).exec();
      
      console.log(`✅ ${result.deletedCount} restaurants de test supprimés`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des restaurants de test:', error);
      throw error;
    }
  }
}
