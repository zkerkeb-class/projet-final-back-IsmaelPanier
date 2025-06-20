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

  // Méthodes pour la gestion avancée

  // Récupérer les plats en promotion
  async findPromotions(ownerId: string): Promise<Dish[]> {
    try {
      const restaurant = await this.dishModel.db.collection('restaurants').findOne({ 
        ownerId: new Types.ObjectId(ownerId) 
      });
      
      if (!restaurant) return [];

      return await this.dishModel.find({ 
        restaurantId: restaurant._id,
        isPromotion: true,
        promotionEndDate: { $gte: new Date() }
      }).populate('restaurantId').exec();
    } catch (error) {
      console.error('Erreur lors de la récupération des promotions:', error);
      return [];
    }
  }

  // Récupérer les plats du jour
  async findDailySpecials(ownerId: string): Promise<Dish[]> {
    try {
      const restaurant = await this.dishModel.db.collection('restaurants').findOne({ 
        ownerId: new Types.ObjectId(ownerId) 
      });
      
      if (!restaurant) return [];

      return await this.dishModel.find({ 
        restaurantId: restaurant._id,
        isDailySpecial: true
      }).populate('restaurantId').exec();
    } catch (error) {
      console.error('Erreur lors de la récupération des plats du jour:', error);
      return [];
    }
  }

  // Récupérer les plats en stock bas
  async findLowStock(ownerId: string): Promise<Dish[]> {
    try {
      const restaurant = await this.dishModel.db.collection('restaurants').findOne({ 
        ownerId: new Types.ObjectId(ownerId) 
      });
      
      if (!restaurant) return [];

      return await this.dishModel.find({ 
        restaurantId: restaurant._id,
        trackStock: true,
        stockQuantity: { $lte: '$minStockAlert' }
      }).populate('restaurantId').exec();
    } catch (error) {
      console.error('Erreur lors de la récupération des plats en stock bas:', error);
      return [];
    }
  }

  // Mettre à jour le stock d'un plat
  async updateStock(id: string, quantity: number, ownerId: string): Promise<Dish> {
    try {
      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(ownerId)) {
        throw new ForbiddenException('ID invalide');
      }
      
      const dish = await this.dishModel.findById(id).populate({
        path: 'restaurantId',
        match: { ownerId: new Types.ObjectId(ownerId) }
      }).exec();

      if (!dish || !dish.restaurantId) {
        throw new ForbiddenException('Vous ne pouvez pas modifier ce plat');
      }

      if (!dish.trackStock) {
        throw new Error('Ce plat ne suit pas le stock');
      }

      const updatedDish = await this.dishModel.findByIdAndUpdate(
        id, 
        { stockQuantity: quantity }, 
        { new: true }
      ).exec();

      if (!updatedDish) throw new NotFoundException('Plat non trouvé');
      return updatedDish;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Erreur lors de la mise à jour du stock:', error);
      throw new NotFoundException('Erreur lors de la mise à jour du stock');
    }
  }

  // Rechercher des plats par nom ou description
  async searchDishes(ownerId: string, searchTerm: string): Promise<Dish[]> {
    try {
      const restaurant = await this.dishModel.db.collection('restaurants').findOne({ 
        ownerId: new Types.ObjectId(ownerId) 
      });
      
      if (!restaurant) return [];

      const regex = new RegExp(searchTerm, 'i');
      return await this.dishModel.find({ 
        restaurantId: restaurant._id,
        $or: [
          { name: regex },
          { description: regex },
          { tags: regex }
        ]
      }).populate('restaurantId').exec();
    } catch (error) {
      console.error('Erreur lors de la recherche de plats:', error);
      return [];
    }
  }

  // Récupérer les statistiques des plats
  async getDishStats(ownerId: string): Promise<any> {
    try {
      const restaurant = await this.dishModel.db.collection('restaurants').findOne({ 
        ownerId: new Types.ObjectId(ownerId) 
      });
      
      if (!restaurant) return {};

      const stats = await this.dishModel.aggregate([
        { $match: { restaurantId: restaurant._id } },
        {
          $group: {
            _id: null,
            totalDishes: { $sum: 1 },
            availableDishes: { $sum: { $cond: ['$isAvailable', 1, 0] } },
            dailySpecials: { $sum: { $cond: ['$isDailySpecial', 1, 0] } },
            promotions: { $sum: { $cond: ['$isPromotion', 1, 0] } },
            lowStockDishes: {
              $sum: {
                $cond: [
                  { $and: ['$trackStock', { $lte: ['$stockQuantity', '$minStockAlert'] }] },
                  1,
                  0
                ]
              }
            },
            averagePrice: { $avg: '$basePrice' },
            totalViews: { $sum: '$viewCount' }
          }
        }
      ]);

      return stats[0] || {};
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {};
    }
  }

  // Incrémenter le compteur de vues
  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.dishModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
  }

  // Marquer un plat comme populaire
  async togglePopular(id: string, ownerId: string): Promise<Dish> {
    try {
      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(ownerId)) {
        throw new ForbiddenException('ID invalide');
      }
      
      const dish = await this.dishModel.findById(id).populate({
        path: 'restaurantId',
        match: { ownerId: new Types.ObjectId(ownerId) }
      }).exec();

      if (!dish || !dish.restaurantId) {
        throw new ForbiddenException('Vous ne pouvez pas modifier ce plat');
      }

      const updatedDish = await this.dishModel.findByIdAndUpdate(
        id, 
        { isPopular: !dish.isPopular }, 
        { new: true }
      ).exec();

      if (!updatedDish) throw new NotFoundException('Plat non trouvé');
      return updatedDish;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Erreur lors du changement de statut populaire:', error);
      throw new NotFoundException('Erreur lors de la modification');
    }
  }
}
