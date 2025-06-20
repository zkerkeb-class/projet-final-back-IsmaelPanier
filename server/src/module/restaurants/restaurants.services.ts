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

  async getRestaurantByOwnerId(ownerId: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findOne({ ownerId: new Types.ObjectId(ownerId) }).exec();

    if (!restaurant) {
      throw new NotFoundException('Aucun restaurant trouvé pour cet utilisateur');
    }

    console.log('📥 Restaurant récupéré pour ownerId:', ownerId);
    console.log('📋 Infos :', restaurant);

    return restaurant;
  }
}
