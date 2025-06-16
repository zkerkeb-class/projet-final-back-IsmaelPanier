import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('restaurant')
@UseGuards(JwtStrategy, RolesGuard)
export class RestaurantController {
  @Get('dashboard')
  @Roles(UserRole.RESTAURANT)
  getDashboard(@Req() req) {
    return {
      message: 'Données accessibles uniquement aux restaurants',
      user: req.user,
    };
  }
}
