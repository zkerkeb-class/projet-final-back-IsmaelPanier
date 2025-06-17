import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dish, DishDocument } from './schemas/dish.schema';
import { Model } from 'mongoose';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(@InjectModel(Dish.name) private dishModel: Model<DishDocument>) {}

  async create(dto: CreateDishDto): Promise<Dish> {
    return this.dishModel.create(dto);
  }

  async findAll(): Promise<Dish[]> {
    return this.dishModel.find().populate('restaurantId');
  }

  async findByRestaurant(restaurantId: string): Promise<Dish[]> {
    return this.dishModel.find({ restaurantId }).populate('restaurantId');
  }

  async findOne(id: string): Promise<Dish> {
    const dish = await this.dishModel.findById(id).populate('restaurantId');
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  async update(id: string, dto: UpdateDishDto): Promise<Dish> {
    const dish = await this.dishModel.findByIdAndUpdate(id, dto, { new: true });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  async remove(id: string): Promise<void> {
    const result = await this.dishModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Dish not found');
  }
}
