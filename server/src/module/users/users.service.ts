// src/module/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // findByEmail doit renvoyer UserDocument | null
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Création d'un utilisateur : retourne UserDocument
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
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
}