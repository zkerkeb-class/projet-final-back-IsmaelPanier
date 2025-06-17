// src/module/orders/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Client qui a passé la commande

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId; // Restaurant concerné

  @Prop({ type: [{ dishId: Types.ObjectId, quantity: Number, price: Number }], required: true })
  items: {
    dishId: Types.ObjectId;
    quantity: number;
    price: number; // Prix unitaire au moment de la commande
  }[];

  @Prop({ required: true })
  totalPrice: number; // Total de la commande

  @Prop({ enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Prop()
  deliveryAddress?: string;

  @Prop()
  deliveryPhone?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
