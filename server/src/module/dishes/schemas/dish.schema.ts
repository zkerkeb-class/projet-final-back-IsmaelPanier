// src/module/dishes/dish.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DishDocument = Dish & Document;

@Schema({ timestamps: true })
export class Dish {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;  // Référence au restaurant

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  elements?: string[]; // Liste d’éléments, options ou ingrédients
}

export const DishSchema = SchemaFactory.createForClass(Dish);
