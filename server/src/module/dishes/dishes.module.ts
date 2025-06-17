// src/module/dishes/dishes.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from './schemas/dish.schema';
import { DishesService } from './dishes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }])],
  providers: [DishesService],
  exports: [DishesService], // Important pour que les autres modules puissent utiliser ce service
})
export class DishesModule {}
