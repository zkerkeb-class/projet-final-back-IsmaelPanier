import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    NotFoundException,

} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


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