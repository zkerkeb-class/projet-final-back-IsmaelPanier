import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    NotFoundException,
    UseGuards,
    Request,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService : UsersService) {}

// Crée un utilisateur
    @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.UsersService.create(createUserDto);
    return {
      success: true,
      data: user,
      message: 'Utilisateur créé avec succès',
    };
  }

    // Recup tous les utilisateurs
    @Get()
    async findAll() {
        return await this.UsersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.UsersService.findById(id);
        if(!user) throw new NotFoundException('Utilisateur non trouvé');
        return user;
    }

    // Endpoint pour mettre à jour le profil de l'utilisateur connecté
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user.userId;
        const updatedUser = await this.UsersService.update(userId, updateUserDto);
        return {
            success: true,
            data: updatedUser,
            message: 'Profil mis à jour avec succès',
        };
    }

    // Modifier un utilisateur
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.UsersService.update(id, updateUserDto);
    }

    // Supprimer un utilisateur
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.UsersService.delete(id);
    }

    // Routes pour les favoris
    @Get('favorites')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.User)
    async getFavorites(@Request() req) {
        const userId = req.user.userId;
        const favorites = await this.UsersService.getFavorites(userId);
        return {
            success: true,
            data: favorites,
            message: 'Favoris récupérés avec succès',
        };
    }

    @Post('favorites/:restaurantId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.User)
    async addRestaurantToFavorites(@Request() req, @Param('restaurantId') restaurantId: string) {
        const userId = req.user.userId;
        const favorite = await this.UsersService.addFavorite(userId, restaurantId);
        return {
            success: true,
            data: favorite,
            message: 'Restaurant ajouté aux favoris',
        };
    }

    @Post('favorites/dish/:dishId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.User)
    async addDishToFavorites(@Request() req, @Param('dishId') dishId: string) {
        const userId = req.user.userId;
        const favorite = await this.UsersService.addFavorite(userId, undefined, dishId);
        return {
            success: true,
            data: favorite,
            message: 'Plat ajouté aux favoris',
        };
    }

    @Delete('favorites/:restaurantId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.User)
    async removeRestaurantFromFavorites(@Request() req, @Param('restaurantId') restaurantId: string) {
        const userId = req.user.userId;
        const result = await this.UsersService.removeFavorite(userId, restaurantId);
        return {
            success: true,
            data: result,
            message: 'Restaurant retiré des favoris',
        };
    }

    @Delete('favorites/dish/:dishId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.User)
    async removeDishFromFavorites(@Request() req, @Param('dishId') dishId: string) {
        const userId = req.user.userId;
        const result = await this.UsersService.removeFavorite(userId, undefined, dishId);
        return {
            success: true,
            data: result,
            message: 'Plat retiré des favoris',
        };
    }

    // Endpoint pour vérifier si un email existe déjà
    @Post('check-email')
    async checkEmail(@Body() body: { email: string }) {
        const existingUser = await this.UsersService.findByEmail(body.email);
        return {
            exists: !!existingUser,
            message: existingUser ? 'Cet email est déjà utilisé' : 'Email disponible'
        };
    }
}