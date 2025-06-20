import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dish, DishDocument } from './schemas/dish.schema';
import { Model, Types } from 'mongoose';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish.name) private dishModel: Model<DishDocument>
  ) {}

  async create(dto: CreateDishDto, ownerId: string): Promise<Dish> {
    try {
      console.log('🍽️ Service: Création du plat...');
      console.log('📦 DTO reçu dans le service:', dto);
      console.log('👤 OwnerId reçu dans le service:', ownerId);
      
      // Pour l'instant, on utilise le restaurantId du DTO
      // Le contrôleur s'assurera que c'est le bon restaurant
      const createdDish = await this.dishModel.create(dto);
      console.log('✅ Service: Plat créé avec succès:', createdDish);
      
      return createdDish;
    } catch (error) {
      console.error('❌ Service: Erreur lors de la création du plat:', error);
      throw error;
    }
  }

  async findAll(): Promise<Dish[]> {
    try {
      console.log('🔍 Récupération de tous les plats...');
      const dishes = await this.dishModel.find().populate('restaurantId').exec();
      console.log('📋 Plats trouvés:', dishes.length);
      console.log('📋 Détails des plats:', JSON.stringify(dishes, null, 2));
      return dishes;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des plats:', error);
      return [];
    }
  }

  async findByRestaurant(restaurantId: string): Promise<Dish[]> {
    try {
      console.log('🔍 Récupération des plats pour restaurantId:', restaurantId);
      if (!Types.ObjectId.isValid(restaurantId)) {
        console.log('❌ restaurantId invalide:', restaurantId);
        return [];
      }
      const dishes = await this.dishModel.find({ restaurantId }).populate('restaurantId').exec();
      console.log('📋 Plats trouvés pour ce restaurant:', dishes.length);
      console.log('📋 Détails des plats:', JSON.stringify(dishes, null, 2));
      return dishes;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des plats du restaurant:', error);
      return [];
    }
  }

  // Nouvelle méthode pour trouver les plats par propriétaire du restaurant
  async findByRestaurantOwner(ownerId: string): Promise<Dish[]> {
    try {
      console.log('🔍 findByRestaurantOwner - OwnerId:', ownerId);
      if (!Types.ObjectId.isValid(ownerId)) {
        console.log('❌ OwnerId invalide:', ownerId);
        return [];
      }
      
      // Approche plus simple : d'abord trouver le restaurant, puis ses plats
      const restaurant = await this.dishModel.db.collection('restaurants').findOne({ 
        ownerId: new Types.ObjectId(ownerId) 
      });
      
      if (!restaurant) {
        console.log('❌ Restaurant non trouvé pour ownerId:', ownerId);
        return [];
      }
      
      console.log('🏪 Restaurant trouvé:', restaurant._id);
      
      // Maintenant chercher les plats de ce restaurant
      const dishes = await this.dishModel.find({ 
        restaurantId: restaurant._id 
      }).populate('restaurantId').exec();
      
      console.log('📋 Plats trouvés pour ce restaurant:', dishes.length);
      console.log('📋 Détails des plats:', JSON.stringify(dishes, null, 2));
      
      return dishes;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des plats du propriétaire:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<Dish> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('ID de plat invalide');
      }
      
      const dish = await this.dishModel.findById(id).populate('restaurantId').exec();
      if (!dish) throw new NotFoundException('Plat non trouvé');
      return dish;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erreur lors de la récupération du plat:', error);
      throw new NotFoundException('Erreur lors de la récupération du plat');
    }
  }

  async update(id: string, dto: UpdateDishDto, ownerId: string): Promise<Dish> {
    try {
      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(ownerId)) {
        throw new ForbiddenException('ID invalide');
      }
      
      // Vérifier que le plat appartient au restaurant connecté
      const dish = await this.dishModel.findById(id).populate({
        path: 'restaurantId',
        match: { ownerId: new Types.ObjectId(ownerId) }
      }).exec();

      if (!dish || !dish.restaurantId) {
        throw new ForbiddenException('Vous ne pouvez pas modifier ce plat');
      }

      const updatedDish = await this.dishModel.findByIdAndUpdate(id, dto, { new: true }).exec();
      if (!updatedDish) throw new NotFoundException('Plat non trouvé');
      return updatedDish;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Erreur lors de la mise à jour du plat:', error);
      throw new NotFoundException('Erreur lors de la mise à jour du plat');
    }
  }

  async remove(id: string, ownerId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(ownerId)) {
        throw new ForbiddenException('ID invalide');
      }
      
      // Vérifier que le plat appartient au restaurant connecté
      const dish = await this.dishModel.findById(id).populate({
        path: 'restaurantId',
        match: { ownerId: new Types.ObjectId(ownerId) }
      }).exec();

      if (!dish || !dish.restaurantId) {
        throw new ForbiddenException('Vous ne pouvez pas supprimer ce plat');
      }

      const result = await this.dishModel.findByIdAndDelete(id).exec();
      if (!result) throw new NotFoundException('Plat non trouvé');
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Erreur lors de la suppression du plat:', error);
      throw new NotFoundException('Erreur lors de la suppression du plat');
    }
  }
}
