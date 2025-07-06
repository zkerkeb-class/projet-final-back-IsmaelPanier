import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RestaurantService } from './restaurants.services';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant-dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Route publique pour lister tous les restaurants (accessible aux utilisateurs)
  @Get()
  async getAllRestaurants() {
    return this.restaurantService.getAllRestaurants();
  }

  // Routes protégées pour les restaurants (doivent venir avant les routes avec paramètres)
  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  getDashboard(@Req() req) {
    return {
      message: 'Données accessibles uniquement aux restaurants',
      user: req.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async getAfficheRestaurant(@Req() req) {
    const ownerId = req.user.userId;
    console.log('Les infos du restaurant pour ownerId :', ownerId);

    const restaurant = await this.restaurantService.getRestaurantByOwnerId(ownerId);
    
    if (!restaurant) {
      return {
        success: false,
        message: 'Aucun restaurant trouvé pour cet utilisateur. Veuillez d\'abord créer votre restaurant.',
        data: null
      };
    }

    return {
      success: true,
      data: restaurant,
    };
  }

  // Route publique pour obtenir un restaurant par ID (doit venir après les routes spécifiques)
  @Get(':id')
  async getRestaurantById(@Param('id') id: string) {
    return this.restaurantService.getRestaurantById(id);
  }

  // Routes protégées pour les restaurants
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async create(@Body() dto: CreateRestaurantDto, @Req() req: any) {
     console.log('👤 ownerId reçu dans req.user.userId :', req.user.userId); 
    const ownerId = req.user.userId;
    return this.restaurantService.createRestaurant(dto, ownerId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  async updateMyRestaurant(
    @Body() dto: UpdateRestaurantDto,
    @Req() req: any,
  ) {
    const ownerId = req.user.userId;

    console.log('ownerId:', ownerId);
    console.log('Update DTO:', dto);

    return this.restaurantService.updateMyRestaurant(ownerId, dto);
  }
}
