import { Controller, Post, Body, Get, Param, Delete, Query, Put, UseGuards, Req } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RestaurantService } from '../restaurants/restaurants.services';
import { NotificationsGateway } from '../../notifications/notifications.gateway';

@Controller('dishes')
export class DishesController {
      constructor(
    private readonly dishesService: DishesService,
    private readonly restaurantService: RestaurantService,
    private readonly notificationsGateway: NotificationsGateway
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
    
    let restaurant = await this.restaurantService.getRestaurantByOwnerId(ownerId);
    console.log('🏪 Restaurant trouvé:', restaurant);
    
    // Si pas de restaurant, en créer un par défaut
    if (!restaurant) {
      console.log('🏪 Aucun restaurant trouvé, création d\'un restaurant par défaut...');
      
      const defaultRestaurantData = {
        name: `Restaurant de ${req.user.email}`,
        description: 'Bienvenue dans notre restaurant ! Nous proposons des plats délicieux préparés avec soin.',
        cuisine: 'Cuisine du monde',
        address: {
          street: 'Adresse à définir',
          city: 'Ville à définir',
          postalCode: '00000',
          country: 'France'
        },
        phone: 'Téléphone à définir',
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
        }
      };
      
      restaurant = await this.restaurantService.createRestaurant(defaultRestaurantData, ownerId);
      console.log('✅ Restaurant par défaut créé:', restaurant);
    }
    
    // S'assurer que le restaurantId correspond au restaurant connecté
    const dishData = {
      ...dto,
      restaurantId: (restaurant as any)._id
    };
    
    console.log('🍽️ Données du plat à créer:', dishData);

    const createdDish = await this.dishesService.create(dishData, ownerId);
    console.log('✅ Plat créé avec succès:', createdDish);
    
    // 🔥 Notification Socket.io
    this.notificationsGateway.dishAdded(ownerId, createdDish);
    
    return createdDish;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async update(@Param('id') id: string, @Body() dto: UpdateDishDto, @Req() req: any) {
    const ownerId = req.user.userId;
    const updatedDish = await this.dishesService.update(id, dto, ownerId);
    
    // 🔥 Notification Socket.io
    this.notificationsGateway.dishUpdated(ownerId, updatedDish);
    
    return updatedDish;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async remove(@Param('id') id: string, @Req() req: any) {
    const ownerId = req.user.userId;
    
    // Récupérer le plat avant suppression pour avoir le nom
    const dish = await this.dishesService.findOne(id);
    await this.dishesService.remove(id, ownerId);
    
    // 🔥 Notification Socket.io
    this.notificationsGateway.dishDeleted(ownerId, dish.name);
    
    return { message: 'Plat supprimé avec succès' };
  }
}