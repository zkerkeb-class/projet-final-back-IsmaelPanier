import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantController } from './restaurants.controller';
import { RestaurantService } from './restaurants.services';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
