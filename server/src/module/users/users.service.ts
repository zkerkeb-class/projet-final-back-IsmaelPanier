// src/module/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../common/enums/user-role.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
  const user = new this.userModel({
    ...registerDto,
    role: registerDto.role || UserRole.User, 
  });
  return user.save();
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