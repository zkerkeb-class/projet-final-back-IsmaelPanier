import { Controller, Post, Body, Get, Param, Delete, Query, Put, UseGuards, Req } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RestaurantService } from '../restaurants/restaurants.services';

@Controller('dishes')
export class DishesController {
    constructor(
      private readonly dishesService: DishesService,
      private readonly restaurantService: RestaurantService
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
    
    const restaurant = await this.restaurantService.getRestaurantByOwnerId(ownerId);
    console.log('🏪 Restaurant trouvé:', restaurant);
    
    // S'assurer que le restaurantId correspond au restaurant connecté
    const dishData = {
      ...dto,
      restaurantId: (restaurant as any)._id
    };
    
    console.log('🍽️ Données du plat à créer:', dishData);

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