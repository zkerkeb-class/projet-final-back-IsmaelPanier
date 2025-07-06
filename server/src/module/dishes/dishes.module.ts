// src/module/dishes/dishes.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from './schemas/dish.schema';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dish.name, schema: DishSchema },
      { name: Restaurant.name, schema: RestaurantSchema }
    ])
  ],
  providers: [DishesService],
  controllers: [DishesController],
  exports: [DishesService], // Important pour que les autres modules puissent utiliser ce service
})
export class DishesModule {}
