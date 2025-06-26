// src/module/users/users.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Favorite, FavoriteDocument } from './schemas/favorite.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../common/enums/user-role.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  // findByEmail doit renvoyer UserDocument | null
//   async findByEmail(email: string): Promise<UserDocument | null> {
//     return this.userModel.findOne({ email }).exec();
//   }

async findByEmail(email: string): Promise<UserDocument | null> {
  return this.userModel.findOne({ email }).select('+password').exec();
}


  // Création d'un utilisateur : retourne UserDocument
async create(registerDto: RegisterDto): Promise<UserDocument> {
  console.log('usersService.create - Données reçues:', registerDto);
  const user = new this.userModel({
    ...registerDto,
    role: registerDto.role || UserRole.User, 
  });
  try {
    const savedUser = await user.save();
    console.log('usersService.create - Utilisateur sauvegardé:', savedUser);
    return savedUser;
  } catch (err) {
    console.error('usersService.create - Erreur lors de la sauvegarde:', err);
    throw err;
  }
}




  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  // Méthodes pour les favoris - CORRIGÉES
  async getFavorites(userId: string) {
    // Vérifier d'abord si l'utilisateur existe
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.favoriteModel.find({ userId })
      .populate('restaurantId')
      .populate('dishId')
      .populate({
        path: 'dishId',
        populate: {
          path: 'restaurantId',
          model: 'Restaurant'
        }
      })
      .exec();
  }

  async addFavorite(userId: string, restaurantId?: string, dishId?: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    if (!restaurantId && !dishId) {
      throw new BadRequestException('Either restaurantId or dishId must be provided');
    }

    const type = restaurantId ? 'restaurant' : 'dish';
    const favoriteData = {
      userId: new Types.ObjectId(userId),
      type,
      ...(restaurantId && { restaurantId: new Types.ObjectId(restaurantId) }),
      ...(dishId && { dishId: new Types.ObjectId(dishId) })
    };

    const favorite = new this.favoriteModel(favoriteData);
    return favorite.save();
  }

  async removeFavorite(userId: string, restaurantId?: string, dishId?: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    const filter: any = { userId: new Types.ObjectId(userId) };
    
    if (restaurantId) {
      filter.restaurantId = new Types.ObjectId(restaurantId);
    }
    if (dishId) {
      filter.dishId = new Types.ObjectId(dishId);
    }

    const result = await this.favoriteModel.deleteOne(filter).exec();
    return { deleted: result.deletedCount > 0 };
  }

  async isFavorite(userId: string, restaurantId?: string, dishId?: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }

    const filter: any = { userId: new Types.ObjectId(userId) };
    
    if (restaurantId) {
      filter.restaurantId = new Types.ObjectId(restaurantId);
    }
    if (dishId) {
      filter.dishId = new Types.ObjectId(dishId);
    }

    const favorite = await this.favoriteModel.findOne(filter).exec();
    return !!favorite;
  }
}