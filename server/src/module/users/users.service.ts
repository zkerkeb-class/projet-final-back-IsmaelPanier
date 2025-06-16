// src/module/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    async findByEmail(email: string): Promise<User | null> {
  return await this.userModel.findOne({ email }).exec();
}

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 🔐 Création d'un utilisateur
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  // Récupération de tous les utilisateurs
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  // Récupération d'un utilisateur par ID
  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  //  Mise à jour d'un utilisateur
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }

    return updatedUser;
  }




  // Suppression d'un utilisateur
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }
}
