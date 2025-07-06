import { Controller, Post, Body, Get, Param, Delete, Query, Put, UseGuards, Req } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../restaurants/schemas/restaurant.schema';

@Controller('dishes')
export class DishesController {
    constructor(
      private readonly dishesService: DishesService,
      @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>
    ) {}

  // Route publique pour tous les plats ou plats d'un restaurant spécifique
  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    return restaurantId
      ? this.dishesService.findByRestaurant(restaurantId)
      : this.dishesService.findAll();
  }

  // Route publique pour obtenir les plats d'un restaurant spécifique
  @Get('restaurant/:restaurantId')
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.dishesService.findByRestaurant(restaurantId);
  }

  // Route protégée pour que le restaurant connecté voie ses propres plats
  @Get('my-dishes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async getMyDishes(@Req() req: any) {
    const ownerId = req.user.userId;
    return this.dishesService.findByRestaurantOwner(ownerId);
  }

  // Route publique pour un plat spécifique
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(id);
  }

  // Routes protégées pour les restaurants
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async create(@Body() dto: CreateDishDto, @Req() req: any) {
    console.log('🍽️ Création d\'un nouveau plat...');
    console.log('👤 User connecté:', req.user);
    console.log('📦 DTO reçu:', dto);
    
    // Récupérer le restaurant du propriétaire connecté
    const ownerId = req.user.userId;
    console.log('🏪 OwnerId:', ownerId);
    
    let restaurant = await this.restaurantModel.findOne({ ownerId: new Types.ObjectId(ownerId) }).exec();
    console.log('🏪 Restaurant trouvé:', restaurant);
    
    // Si l'utilisateur n'a pas de restaurant, en créer un automatiquement
    if (!restaurant) {
      console.log('🏪 Aucun restaurant trouvé, création automatique...');
      try {
        restaurant = await this.restaurantModel.create({
          name: `${req.user.firstName || 'Mon'} Restaurant`,
          description: 'Restaurant créé automatiquement',
          cuisine: 'Française',
          address: {
            street: 'Adresse à compléter',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          phone: 'Téléphone à compléter',
          email: req.user.email,
          priceRange: 'Moyen',
          openingHours: {
            monday: '11:00-22:00',
            tuesday: '11:00-22:00',
            wednesday: '11:00-22:00',
            thursday: '11:00-22:00',
            friday: '11:00-23:00',
            saturday: '11:00-23:00',
            sunday: '12:00-21:00'
          },
          deliveryOptions: ['Livraison', 'Emporter'],
          paymentMethods: ['Carte', 'Espèces'],
          ownerId: new Types.ObjectId(ownerId)
        });
        console.log('✅ Restaurant créé automatiquement:', restaurant);
      } catch (error) {
        console.error('❌ Erreur création restaurant:', error);
        throw new Error('Impossible de créer un restaurant pour cet utilisateur');
      }
    }
    
    // S'assurer que le restaurantId correspond au restaurant connecté et est un ObjectId
    const restaurantDoc = restaurant as RestaurantDocument;
    const dishData = {
      ...dto,
      restaurantId: (restaurantDoc as any)._id?.toString() || restaurantDoc.id // Utiliser _id ou id
    };
    
    console.log('🍽️ Données du plat à créer:', dishData);
    console.log('🏪 RestaurantId assigné:', dishData.restaurantId);
    console.log('🏪 Type du restaurantId:', typeof dishData.restaurantId);

    const createdDish = await this.dishesService.create(dishData, ownerId);
    console.log('✅ Plat créé avec succès:', createdDish);
    
    return createdDish;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  update(@Param('id') id: string, @Body() dto: UpdateDishDto, @Req() req: any) {
    const ownerId = req.user.userId;
    return this.dishesService.update(id, dto, ownerId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  remove(@Param('id') id: string, @Req() req: any) {
    const ownerId = req.user.userId;
    return this.dishesService.remove(id, ownerId);
  }
}