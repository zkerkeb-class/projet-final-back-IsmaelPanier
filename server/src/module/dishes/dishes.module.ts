// src/module/dishes/dishes.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from './schemas/dish.schema';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }]),
    RestaurantModule,
    NotificationsModule
  ],
  providers: [DishesService],
  controllers: [DishesController],
  exports: [DishesService], // pour être utilisé par OrdersService par exemple
})
export class DishesModule {}
