// src/module/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { DishesModule } from '../dishes/dishes.module'; // <-- Import du module dishes

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    DishesModule, // <-- Ajouté ici
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
