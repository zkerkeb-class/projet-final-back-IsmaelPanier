import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RestaurantService } from './restaurants.services';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant-dto';
@Controller('restaurant')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @Roles(UserRole.RESTAURANT)
  async create(@Body() dto: CreateRestaurantDto, @Req() req: any) {
     console.log('👤 ownerId reçu dans req.user.userId :', req.user.userId); 
    const ownerId = req.user.userId;
    return this.restaurantService.createRestaurant(dto, ownerId);
  }

  @Get('dashboard')
  @Roles(UserRole.RESTAURANT)
  getDashboard(@Req() req) {
    return {
      message: 'Données accessibles uniquement aux restaurants',
      user: req.user,
    };
  }
  @Get('me')
@Roles(UserRole.RESTAURANT)
async getAfficheRestaurant(@Req() req) {
  const ownerId = req.user.userId;
  console.log('Les infos du restaurant pour ownerId :', ownerId);

  const restaurant = await this.restaurantService.getRestaurantByOwnerId(ownerId);
  return {
    success: true,
    data: restaurant,
  };
}


@Put('me')
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
