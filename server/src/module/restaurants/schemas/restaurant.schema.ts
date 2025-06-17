// src/module/restaurants/restaurant.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;  // Référence au user propriétaire

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
