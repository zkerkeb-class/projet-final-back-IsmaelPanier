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

  @Prop({ enum: ['Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Accompagnement'] })
  category?: string;

  @Prop({ type: [String], default: [] })
  ingredients?: string[]; // Liste des ingrédients

  @Prop({ type: [String], default: [] })
  allergens?: string[]; // Liste des allergènes

  @Prop({ type: Number, min: 0 })
  preparationTime?: number; // Temps de préparation en minutes

  @Prop({ default: true })
  isAvailable?: boolean; // Si le plat est disponible

  @Prop()
  imageUrl?: string; // URL de l'image du plat

  @Prop({ type: [String], default: [] })
  tags?: string[]; // Tags pour la recherche (ex: "végétarien", "épicé", etc.)

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating?: number; // Note moyenne du plat

  @Prop({ type: Number, default: 0 })
  orderCount?: number; // Nombre de fois commandé
}

export const DishSchema = SchemaFactory.createForClass(Dish);
