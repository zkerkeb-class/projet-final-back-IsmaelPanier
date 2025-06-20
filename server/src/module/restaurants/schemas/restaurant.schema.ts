// src/module/restaurants/restaurant.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserAddress } from '../../../common/enums/user-role.enum';

// Interface pour les horaires d'ouverture
export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;  // Référence au user propriétaire

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  })
  address?: UserAddress;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  cuisine?: string;

  @Prop({ enum: ['Économique', 'Moyen', 'Élevé', 'Luxe'] })
  priceRange?: string;

  @Prop({
    type: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    }
  })
  openingHours?: OpeningHours;

  @Prop({ type: [String] })
  deliveryOptions?: string[];

  @Prop({ type: [String] })
  paymentMethods?: string[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
