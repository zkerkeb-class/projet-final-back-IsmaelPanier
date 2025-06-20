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
        const userId = req.user.id;
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
}