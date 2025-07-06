// src/module/dishes/dish.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DishDocument = Dish & Document;

// Interface pour les options de prix (petite/grande portion)
export interface PriceOption {
  name: string;        // "Petite portion", "Grande portion", "Menu complet"
  price: number;       // Prix de cette option
  description?: string; // Description de l'option
}

// Interface pour les ingrédients détaillés
export interface Ingredient {
  name: string;        // Nom de l'ingrédient
  quantity: string;    // Quantité (ex: "100g", "1 cuillère")
  isAllergen: boolean; // Si c'est un allergène
  allergenType?: string; // Type d'allergène si applicable
}

// Interface pour les images
export interface DishImage {
  url: string;         // URL de l'image
  alt: string;         // Texte alternatif
  isMain: boolean;     // Si c'est l'image principale
  order: number;       // Ordre d'affichage
}

@Schema({ timestamps: true })
export class Dish {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;  // Référence au restaurant

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  basePrice: number; // Prix de base

  @Prop({ type: [Object], default: [] })
  priceOptions?: PriceOption[]; // Options de prix (petite/grande portion)

  @Prop({ enum: ['Entrées', 'Plats principaux', 'Pizzas', 'Burgers', 'Sushis', 'Salades', 'Desserts', 'Boissons'] })
  category?: string;

  @Prop({ type: [Object], default: [] })
  ingredients?: Ingredient[]; // Ingrédients détaillés

  @Prop({ type: [String], default: [] })
  allergens?: string[]; // Liste des allergènes principaux

  @Prop({ type: Number, min: 0 })
  preparationTime?: number; // Temps de préparation en minutes

  @Prop({ default: true })
  isAvailable?: boolean; // Si le plat est disponible

  @Prop({ type: [Object], default: [] })
  images?: DishImage[]; // Images multiples du plat

  @Prop({ type: [String], default: [] })
  tags?: string[]; // Tags pour la recherche (ex: "végétarien", "épicé", etc.)

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating?: number; // Note moyenne du plat

  @Prop({ type: Number, default: 0 })
  orderCount?: number; // Nombre de fois commandé

  // Gestion des stocks
  @Prop({ type: Number, min: 0, default: -1 })
  stockQuantity?: number; // -1 = stock illimité, 0+ = quantité limitée

  @Prop({ default: false })
  trackStock?: boolean; // Si on doit suivre le stock

  @Prop({ type: Number, min: 0, default: 0 })
  minStockAlert?: number; // Seuil d'alerte de stock bas

  // Promotions et plats du jour
  @Prop({ default: false })
  isDailySpecial?: boolean; // Si c'est un plat du jour

  @Prop({ default: false })
  isPromotion?: boolean; // Si c'est en promotion

  @Prop({ type: Number, min: 0, max: 100 })
  discountPercentage?: number; // Pourcentage de réduction

  @Prop()
  promotionStartDate?: Date; // Date de début de promotion

  @Prop()
  promotionEndDate?: Date; // Date de fin de promotion

  @Prop()
  promotionDescription?: string; // Description de la promotion

  // Informations nutritionnelles
  @Prop({ type: Number, min: 0 })
  calories?: number; // Calories par portion

  @Prop({ type: Number, min: 0 })
  protein?: number; // Protéines en grammes

  @Prop({ type: Number, min: 0 })
  carbs?: number; // Glucides en grammes

  @Prop({ type: Number, min: 0 })
  fat?: number; // Lipides en grammes

  // Options de personnalisation
  @Prop({ type: [String], default: [] })
  customizationOptions?: string[]; // Options de personnalisation (ex: "Sans oignons", "Extra fromage")

  @Prop({ type: [Object], default: [] })
  addOns?: {
    name: string;
    price: number;
    description?: string;
  }[]; // Suppléments disponibles

  // Métadonnées
  @Prop({ type: Number, min: 0 })
  cookingTime?: number; // Temps de cuisson en minutes

  @Prop({ type: [String], default: [] })
  dietaryInfo?: string[]; // Informations diététiques (ex: "Végétarien", "Sans gluten")

  @Prop({ default: false })
  isSpicy?: boolean; // Si le plat est épicé

  @Prop({ type: Number, min: 1, max: 5 })
  spiceLevel?: number; // Niveau d'épice (1-5)

  @Prop({ default: false })
  isPopular?: boolean; // Si c'est un plat populaire

  @Prop({ type: Number, default: 0 })
  viewCount?: number; // Nombre de vues du plat

  // Nouveaux champs ajoutés
  @Prop()
  difficulty?: string; // Difficulté de préparation

  @Prop({ default: false })
  isVegetarian?: boolean; // Si le plat est végétarien
}

export const DishSchema = SchemaFactory.createForClass(Dish);
